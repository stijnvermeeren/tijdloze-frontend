<template lang="pug">
span
  artist-link(v-if="!plainArtist" :artist="song.artist")
  span.plain(v-else) {{song.artist.name}}
  template(v-if='song.secondArtist')
    |  en 
    artist-link(v-if="!plainArtist" :artist='song.secondArtist')
    span.plain(v-else) {{song.secondArtist.name}}
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

defineProps<{
  song: Song
  plainArtist?: boolean
}>()
</script>

<style scoped>
span.plain {
  color: black;
}
</style>
