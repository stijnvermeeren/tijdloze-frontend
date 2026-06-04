<template lang="pug">
nuxt-link(:to='`/nummer/${song.id}-${song.slug}`') {{song.title}}
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

defineProps<{
  song: Song
}>()
</script>

<style scoped>
  a {
    font-style: italic;
  }
</style>
