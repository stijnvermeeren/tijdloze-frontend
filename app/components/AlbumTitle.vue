<template lang="pug">
span
  | {{album.title}}
  span.suffix(v-if="album.isSingle || album.isSoundtrack")
    |  ({{suffix}})
</template>

<script setup lang="ts">
import type Album from "~/orm/Album";

const props = defineProps<{
  album: Album
}>()

const suffix = computed(() => {
  const elements: string[] = []
  if (props.album.isSingle) {
    elements.push("single")
  }
  if (props.album.isSoundtrack) {
    elements.push("soundtrack")
  }
  return elements.join(", ")
})

</script>

<style scoped>
  .suffix {
    font-size: 90%;
  }
</style>
