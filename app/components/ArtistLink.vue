<template lang="pug">
nuxt-link(:to='`/artiest/${artist.id}-${artist.slug}`') {{content}}
</template>

<script setup lang="ts">
import type Artist from "~/orm/Artist";

const props = defineProps<{
  artist: Artist
  text?: string
}>()

const content = computed(() => {
  return props.text ? props.text : props.artist.name;
})
</script>
