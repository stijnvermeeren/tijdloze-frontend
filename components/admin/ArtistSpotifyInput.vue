<template lang="pug">
div.d-flex
  v-text-field(v-model='spotifyId' label="Spotify ID" hide-details)
  v-btn.ml-2(v-if='spotifyId' :icon="mdiOpenInNew" :href="link" target="_blank")
</template>

<script setup>
import {mdiOpenInNew} from "@mdi/js";

const spotifyId = defineModel()

const link = computed(() => {
  return `https://open.spotify.com/artist/${spotifyId.value}`
})
</script>
