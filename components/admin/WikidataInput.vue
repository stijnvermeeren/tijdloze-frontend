<template lang="pug">
div.d-flex
  v-text-field(v-model="wikidataId" label="Wikidata Id" hide-details)
  v-btn.ml-2(v-if='wikidataId' :icon="mdiOpenInNew" :href="visitUrl" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const wikidataId = defineModel()

const props = defineProps({
  query: String
})

const visitUrl = computed(() => {
  return `https://www.wikidata.org/wiki/${wikidataId.value}`
})

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query)
  return `https://www.wikidata.org/w/index.php?go=Go&search=${encodedQuery}&title=Special%3ASearch&ns0=1&ns120=1`
})
</script>
