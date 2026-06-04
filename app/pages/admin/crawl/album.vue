<template lang="pug">
Title Admin: crawler output (albums)
div
  div.flexTitle
    h2 Admin: crawler output (albums)

  h3 Volgende voorstel van crawler

  admin-crawl-process(type="album")

  hr

  v-btn.mt-5(@click="crawl") crawl by song
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
definePageMeta({ middleware: 'admin' })

const {$api} = useNuxtApp()

async function crawl() {
  await $api(apiEndpoints.musicbrainz.crawlSongs())
}
</script>
