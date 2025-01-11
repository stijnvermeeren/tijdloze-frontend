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

<script setup>
import SongLink from "./SongLink";
import ArtistLink from "./ArtistLink";
import Song from "../orm/Song";
import Artist from "../orm/Artist";

const props = defineProps({
  song: Song,
  artist: Artist
})

const secondArtist = computed(() => {
  if (props.artist && props.song.secondArtistId && props.artist.id === props.song.secondArtistId) {
    return props.song.artist
  } else {
    return props.song.secondArtist
  }
})
</script>

<style lang="scss" scoped>
</style>
