<template lang="pug">
Title Admin: Instellingen
div
  h2 Instellingen
  div
    v-switch(v-model="commentsOn" :true-value="'on'" :false-value="'off'" label="Reacties open" hide-details)
  div
    v-switch(v-model="chatOn" :true-value="'on'" :false-value="'off'" label="Chatbox open" hide-details)
  p
    v-btn(@click="invalidateCache") Invalidate API caches
    v-btn(@click="startWikipediaCrawl") Start Wikipedia crawl
  p
    v-btn(@click="musicbrainzArtistDetails") Load artist details from Musicbrainz
    v-btn(@click="musicbrainzAlbumDetails") Load album details from Musicbrainz
  p
    v-btn(@click="wikidataArtistDetails") Load artist details from Wikidata
    v-btn(@click="wikidataAlbumDetails") Load album details from Wikidata
</template>

<script setup>
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

const {data: chatOn} = await useFetch(`text/chatOn`, useFetchOpts({transform: response => response.value}));
const {data: commentsOn} = await useFetch(`text/commentsOn`, useFetchOpts({transform: response => response.value}));

watch(chatOn, async () => {
  const data = {
    text: chatOn.value
  };
  await $api(`text/chatOn`, useFetchOptsPost(data));
})

watch(commentsOn, async () => {
  const data = {
    text: commentsOn.value
  };
  await $api(`text/commentsOn`, useFetchOptsPost(data));
})

async function invalidateCache() {
  await $api('/cache/invalidate', useFetchOpts());
}
async function startWikipediaCrawl() {
  await $api('/wikipedia/crawl', useFetchOpts());
}
async function musicbrainzArtistDetails() {
  await $api('/musicbrainz/crawl-artist-details', useFetchOpts());
}
async function musicbrainzAlbumDetails() {
  await $api('/musicbrainz/crawl-album-details', useFetchOpts());
}
async function wikidataArtistDetails() {
  await $api('/wikidata/crawl-artist-details', useFetchOpts());
}
async function wikidataAlbumDetails() {
  await $api('/wikidata/crawl-album-details', useFetchOpts());
}
</script>

<style scoped>

</style>
