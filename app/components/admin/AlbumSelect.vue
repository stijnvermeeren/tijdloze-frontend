<template lang="pug">
div
  v-autocomplete(
    v-model="albumId"
    :items="candidateAlbums"
    label="Album"
    hide-details
    :error="!albumId"
  )
</template>

<script setup lang="ts">
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import type Album from '~/orm/Album'
import { sortWith, ascend } from 'ramda'

const props = defineProps<{
  artistId: number
}>()

const albumId = defineModel()

const candidateAlbums = computed(() => {
  const artist = useRepo(Artist).with('albums').find(props.artistId);
  if (artist) {
    return sortWith([
      ascend((album: Album) => album.releaseYear),
      ascend((album: Album) => album.title)
    ], artist.albums).map((album: Album) => {
      return {
        value: album.id,
        title: `${album.title} (${album.releaseYear})`
      }
    })
  } else {
    return [];
  }
})
</script>
