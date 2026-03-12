<template lang="pug">
span
  song-link(:song="song")
  template(v-if="secondArtist")
    |
    | (met
    |
    artist-link(:artist="secondArtist")
    | )
</template>

<script setup lang="ts">
import SongLink from "./SongLink.vue";
import ArtistLink from "./ArtistLink.vue";
import type Song from "~/orm/Song";
import type Artist from "~/orm/Artist";

const props = defineProps<{
  song: Song
  artist?: Artist
}>()

const secondArtist = computed<Artist | null>(() => {
  if (props.artist && props.song.secondArtistId && props.artist.id === props.song.secondArtistId) {
    return props.song.artist
  }
  return props.song.secondArtist
})
</script>

<style scoped>
</style>
