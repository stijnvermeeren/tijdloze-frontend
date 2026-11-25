<template lang="pug">
div.d-flex.align-center.flex-wrap
  div.flex-grow-1.d-flex.align-center
    v-text-field(v-model="youtubeVideoId" label="YouTube video ID" hide-details)
  iframe.youtube-preview.ml-3(
    v-if="youtubeVideoId"
    :src="embedUrl"
    title="YouTube video preview"
    frameBorder="0"
    allow="encrypted-media; picture-in-picture"
    allowfullscreen
    loading="lazy"
  )
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank" aria-label="Zoeken op YouTube")
</template>

<script setup lang="ts">
import {mdiSearchWeb} from "@mdi/js";

const youtubeVideoId = defineModel<string>()

const props = defineProps<{
  query: string
}>()

const embedUrl = computed(() => {
  return `https://www.youtube.com/embed/${encodeURIComponent(youtubeVideoId.value ?? '')}`
})

const searchUrl = computed(() => {
  return `https://www.youtube.com/results?search_query=${encodeURIComponent(props.query)}`
})
</script>

<style scoped>
.youtube-preview {
  width: 200px;
  height: 113px;
  border-radius: 12px;
}
</style>
