<template lang="pug">
div.d-flex
  v-text-field(v-model="allMusicUrl" label="AllMusic" hide-details)
  v-btn.ml-2(v-if='allMusicUrl' :icon="mdiOpenInNew" :href="allMusicUrl" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const props = defineProps({
  query: String
})

const allMusicUrl = defineModel()

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query)
  return `https://www.allmusic.com/search/all/${encodedQuery}`
})
</script>
