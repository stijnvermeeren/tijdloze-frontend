<template lang="pug">
ui-card(v-if="crawl")
  template(#title)
    artist-link(v-if="artistModel" :artist="artistModel")
    span(v-if="albumModel")
      album-link(:album="albumModel")
      |  ({{albumModel.releaseYear}})
    song-link(v-if="songModel" :song="songModel")
    span : {{crawl.field}}
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
        :type="type"
        :field="crawl.field"
        :value="crawl.value"
      )
      span(v-else) (Geen waarde)
    div
      h4 Huidige waarde
      admin-link-with-preview(
        v-if="currentValue"
        :type="type"
        :field="crawl.field"
        :value="currentValue"
      )
      span(v-else) (Geen waarde)

div(v-else) Niets meer gevonden...
</template>

<script setup lang="ts">
import type { CrawlEntry, CrawlType } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import Album from "~/orm/Album";
import Song from "~/orm/Song";

const {$api} = useNuxtApp()

const props = defineProps<{
  type: CrawlType
}>()

function getModelId(entry: CrawlEntry | null | undefined): number | undefined {
  if (!entry) {
    return undefined
  }
  if (props.type === 'artist') {
    return entry.artistId
  }
  if (props.type === 'album') {
    return entry.albumId
  }
  return entry.songId
}

const submitting = ref(false)

const {data: crawl, refresh: refreshCrawl} = await useApiFetch(apiEndpoints.crawlProcess.next(props.type))

const storeModel = computed<Artist | Album | Song | undefined>(() => {
  const modelId = getModelId(crawl.value)
  if (!modelId) {
    return undefined
  }

  if (props.type === 'artist') {
    return useRepo(Artist).find(modelId) ?? undefined
  }
  if (props.type === 'album') {
    return useRepo(Album).find(modelId) ?? undefined
  }
  return useRepo(Song).find(modelId) ?? undefined
})

const artistModel = computed(() => props.type === 'artist' ? storeModel.value as Artist | undefined : undefined)
const albumModel = computed(() => props.type === 'album' ? storeModel.value as Album | undefined : undefined)
const songModel = computed(() => props.type === 'song' ? storeModel.value as Song | undefined : undefined)

const currentValue = computed(() => {
  const field = crawl.value?.field
  const model = storeModel.value as Record<string, unknown> | undefined
  if (!field || !model) {
    return undefined
  }
  const value = model[field]
  return value === undefined || value === null ? undefined : String(value)
})

async function refresh() {
  await refreshCrawl()
}

async function accept(id: number) {
  submitting.value = true
  await $api(apiEndpoints.crawlProcess.accept(props.type, id), undefined)
  refresh()
  submitting.value = false
}

async function reject(id: number) {
  submitting.value = true
  await $api(apiEndpoints.crawlProcess.reject(props.type, id))
  refresh()
  submitting.value = false
}
</script>
