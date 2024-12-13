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

<script setup>
definePageMeta({ middleware: 'admin' })

const {$api} = useNuxtApp()

async function crawl() {
  await $api('musicbrainz/crawl-songs')
}
</script>
