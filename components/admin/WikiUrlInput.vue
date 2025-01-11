<template lang="pug">
div.d-flex
  v-text-field(v-model="wikiUrl" :label="label" hide-details)
  v-btn.ml-2(v-if='wikiUrl' :icon="mdiOpenInNew" :href="wikiUrl" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const wikiUrl = defineModel()

const props = defineProps({
  lang: String,
  query: String
})

const label = computed(() => {
  switch (props.lang) {
    case "nl": return "Wikipedia (Nederlands)"
    case "en": return "Wikipedia (Engels)"
    default: return `Wikipedia (${props.lang})`
  }
})

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query)
  return `https://${props.lang}.wikipedia.org/w/index.php?search=${encodedQuery}`
})
</script>
