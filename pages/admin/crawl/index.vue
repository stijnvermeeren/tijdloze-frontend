<template lang="pug">
Title Admin: Crawler
div
  h2 Crawler
  h3 Process results
  ul
    li
      nuxt-link(to="/admin/crawl/artist") Artists
    li
      nuxt-link(to="/admin/crawl/album") Albums
    li
      nuxt-link(to="/admin/crawl/song") Songs
  h3 Wikipedia content
  p (Re)load Wikipedia summary content for all Wikipedia URLs for songs, albums and artists.
  p
    v-btn(@click="call('/wikipedia/crawl')") Start Wikipedia crawl
  h3 Load details from Musicbrainz export
  p Obtain data such as Musicbrainz Ids from the musicbrainz_export dataset, based on artist name and song title.
  p
    v-btn(@click="call('/mbdata/crawl-songs')") Songs
  h3 Load details from Musicbrainz
  p Obtain identifiers such as Wikidata Id by calling the Musicbrainz API with an existing Musicbrainz Id.
  p
    v-btn(@click="call('/musicbrainz/crawl-artist-details')") Artists
    v-btn(@click="call('/musicbrainz/crawl-album-details')") Albums
    v-btn(@click="call('/musicbrainz/crawl-song-details')") Songs
  h3 Load details from Wikidata
  p Obtain identifiers such as Wikipedia URLs by calling the Wikidata API with an existing Wikidata Id.
  p
    v-btn(@click="call('/wikidata/crawl-artist-details')") Artists
    v-btn(@click="call('/wikidata/crawl-album-details')") Albums
    v-btn(@click="call('/wikidata/crawl-song-details')") Songs
</template>

<script setup>
const {$api} = useNuxtApp()

definePageMeta({
  middleware: 'admin'
})

async function call(path) {
  await $api(path, useFetchOpts());
}
</script>

<style scoped>

</style>
