<template lang="pug">
nuxt-link(v-if="song" :to='`/nummer/${song.id}-${song.slug}`') {{song.title}}
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

defineProps<{
  song: Song | null
}>()
</script>

<style scoped>
  a {
    font-style: italic;
  }
</style>
