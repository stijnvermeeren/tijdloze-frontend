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
      span(v-else-if="currentEntityStatus === 'error' && currentEntityError") Huidige waarde kon niet geladen worden
      span(v-else-if="currentEntityStatus === 'success'") (Geen waarde)
      span(v-else) Huidige waarde laden...

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

const submitting = ref(false)

const {data: crawl, refresh: refreshCrawl} = await useApiFetch(apiEndpoints.crawlProcess.next(props.type))

const artistModel = computed<Artist | null>(() => {
  const entry = crawl.value
  if (props.type !== 'artist' || !entry?.artistId) {
    return null
  }
  return useRepo(Artist).find(entry.artistId)
})

const albumModel = computed<Album | null>(() => {
  const entry = crawl.value
  if (props.type !== 'album' || !entry?.albumId) {
    return null
  }
  return useRepo(Album).find(entry.albumId)
})

const songModel = computed<Song | null>(() => {
  const entry = crawl.value
  if (props.type !== 'song' || !entry?.songId) {
    return null
  }
  return useRepo(Song).find(entry.songId)
})

const currentEntityId = computed(() => {
  const entry = crawl.value
  if (props.type === 'artist') {
    return entry?.artistId
  }
  if (props.type === 'album') {
    return entry?.albumId
  }
  return entry?.songId
})

const currentEntityEndpoint = computed(() => {
  const id = currentEntityId.value
  if (props.type === 'artist') {
    return apiEndpoints.artist.byId(id ?? 0)
  }
  if (props.type === 'album') {
    return apiEndpoints.album.byId(id ?? 0)
  }
  return apiEndpoints.song.byId(id ?? 0)
})

const {
  data: currentEntityData,
  status: currentEntityStatus,
  error: currentEntityError
} = await useApiFetch(
  () => currentEntityEndpoint.value,
  {
    immediate: currentEntityId.value !== undefined,
    watch: [currentEntityEndpoint, () => crawl.value?.id]
  }
)

const currentValue = computed(() => {
  const field = crawl.value?.field
  const entity = currentEntityData.value
  if (!field || !entity || currentEntityStatus.value !== 'success' || entity.id !== currentEntityId.value) {
    return undefined
  }
  const value = Object.getOwnPropertyDescriptor(entity, field)?.value
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
