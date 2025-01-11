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
import _ from "lodash"
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";

const props = defineProps({
  artistId: {
    type: Number
  }
})

const albumId = defineModel()

const candidateAlbums = computed(() => {
  const artist = useRepo(Artist).with('albums').find(props.artistId);
  if (artist) {
    return _.sortBy(
        artist.albums,
        [album => album.releaseYear, album => album.title]
    ).map(album => {
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
