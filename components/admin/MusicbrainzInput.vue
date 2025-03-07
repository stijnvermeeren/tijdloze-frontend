<template lang="pug">
div.d-flex
  v-text-field(v-model="musicbrainzId" :label="`Musicbrainz Id (${musicbrainzCategory})`" hide-details)
  v-btn.ml-2(v-if='musicbrainzId' :icon="mdiOpenInNew" :href="visitUrl" target="_blank")
  v-btn.ml-2(v-if='query' :icon="mdiSearchWeb" :href="searchUrl" target="_blank")
</template>

<script setup>
import {mdiOpenInNew, mdiSearchWeb} from "@mdi/js";

const musicbrainzId = defineModel()

const props = defineProps({
  musicbrainzCategory: String,
  query: String
})

const visitUrl = computed(() => {
  return `https://musicbrainz.org/${props.musicbrainzCategory}/${musicbrainzId.value}`
})

const searchUrl = computed(() => {
  const encodedQuery = encodeURIComponent(props.query).replaceAll("%20", "+")
  let type = props.musicbrainzCategory
  if (type === 'release-group') {
    type = 'release_group'
  }
  return `https://musicbrainz.org/search?query=${encodedQuery}&type=${type}&limit=25&method=indexed`
})
</script>
