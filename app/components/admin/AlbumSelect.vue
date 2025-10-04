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

<script setup>
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import { sortWith, ascend } from 'ramda'

const props = defineProps({
  artistId: {
    type: Number
  }
})

const albumId = defineModel()

const candidateAlbums = computed(() => {
  const artist = useRepo(Artist).with('albums').find(props.artistId);
  if (artist) {
    return sortWith([
      ascend(album => album.releaseYear),
      ascend(album => album.title)
    ])(artist.albums).map(album => {
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
