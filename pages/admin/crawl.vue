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
        span Huidige waarde:
        admin-link-with-preview(
          v-if="artist[crawl.field]"
          :field="crawl.field"
          :value="artist[crawl.field]"
        )
        span(v-else) (Geen waarde)
      div
        span Nieuwe waarde
        admin-link-with-preview(
          v-if="crawl.value"
          :field="crawl.field"
          :value="crawl.value"
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

const artist = computed(async () => {
  if (crawl.value) {
    const {data} = await useApiFetch(`artist/${crawl.value.artistId}`)
    return data.value
  } else {
    return undefined
  }
})

const storeArtist = computed(() => {
  if (crawl.value) {
    return useRepo(Artist).find(crawl.value.artistId)
  } else {
    return undefined
  }
})

async function accept(id) {
  submitting.value = true
  await useApiFetchPost(`crawl-artist/${id}`)
  await refreshCrawl()
  submitting.value = false
}

async function reject(id) {
  submitting.value = true
  await useApiFetchDelete(`crawl-artist/${id}`)
  await refreshCrawl()
  submitting.value = false
}
</script>
