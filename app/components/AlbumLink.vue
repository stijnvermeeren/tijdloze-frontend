<template lang="pug">
nuxt-link(:to='`/album/${album.id}-${album.slug}`')
  album-title(:album="album")
</template>

<script setup lang="ts">
import type Album from "~/orm/Album";

defineProps<{
  album: Album
}>()
</script>

<style scoped>
  a {
    font-style: italic;
  }
</style>
