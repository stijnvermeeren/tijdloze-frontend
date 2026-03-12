<template lang="pug">
span
  artist-link(v-if="song.artist" :artist="song.artist")
  template(v-if='song.secondArtist')
    |
    | en
    |
    artist-link(:artist='song.secondArtist')
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

defineProps<{
  song: Song
}>()
</script>
