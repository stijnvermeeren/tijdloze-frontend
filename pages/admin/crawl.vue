<template lang="pug">
Title Admin: crawler output
div
  div.flexTitle
    h2 Admin: crawler output

  h3 Volgende voorstel van crawler

  ui-card(v-if="crawl")
    template(#title) #[artist-link(:artist="storeArtist")]: {{crawl.field}}
    template(#subtitle)
      div Gecrawled: {{crawl.crawlDate}}
      div Kommentaar: {{crawl.comment}}
    template(#buttons)
      v-btn(@click="accept(crawl.id)" color="green" :disabled="submitting") Accepteren
      v-btn(@click="reject(crawl.id)" color="amber" :disabled="submitting") Afwijzen
    div
      div
        h4 Nieuwe waarde
        admin-link-with-preview(
          v-if="crawl.value"
          :field="crawl.field"
          :value="crawl.value"
        )
        span(v-else) (Geen waarde)
      div
        h4 Huidige waarde
        admin-link-with-preview(
          v-if="currentValue"
          :field="crawl.field"
          :value="currentValue"
        )
        span(v-else) (Geen waarde)

  div(v-else) Niets meer gevonden...
</template>

<script setup>
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";

definePageMeta({ middleware: 'admin' })

const submitting = ref(false)

const {data: crawl, refresh: refreshCrawl} = await useApiFetch(`crawl-artist`)
const artistFetchPath = computed(() => {
  return `artist/${crawl?.value?.artistId}`
})
const {data: artist} = await useApiFetch(artistFetchPath, {
  watch: [crawl]
})

const currentValue = computed(() => {
  return artist?.value[crawl?.value?.field]
})

const storeArtist = computed(() => {
  if (crawl.value) {
    return useRepo(Artist).find(crawl.value.artistId)
  } else {
    return undefined
  }
})

async function refresh() {
  await refreshCrawl()
}

async function accept(id) {
  submitting.value = true
  await useApiFetchPost(`crawl-artist/${id}`)
  refresh()
  submitting.value = false
}

async function reject(id) {
  submitting.value = true
  await useApiFetchDelete(`crawl-artist/${id}`)
  refresh()
  submitting.value = false
}
</script>
