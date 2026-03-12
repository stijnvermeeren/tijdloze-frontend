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
import {useRepo} from "pinia-orm";
import Artist from "~/orm/Artist";
import Album from "~/orm/Album";
import Song from "~/orm/Song";
import type ArtistModel from '~/orm/Artist'
import type AlbumModel from '~/orm/Album'
import type SongModel from '~/orm/Song'

const {$api} = useNuxtApp()

type CrawlType = 'artist' | 'album' | 'song'

interface CrawlEntry {
  id: number
  artistId?: number
  albumId?: number
  songId?: number
  field: string
  value?: string
  comment?: string
  crawlDate?: string
}

const props = defineProps<{
  type: CrawlType
}>()

const apiPath = `crawl-${props.type}`

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

const {data: crawl, refresh: refreshCrawl} = await useFetch<CrawlEntry | null>(apiPath, useFetchOpts())

const storeModel = computed<ArtistModel | AlbumModel | SongModel | undefined>(() => {
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

const artistModel = computed(() => props.type === 'artist' ? storeModel.value as ArtistModel | undefined : undefined)
const albumModel = computed(() => props.type === 'album' ? storeModel.value as AlbumModel | undefined : undefined)
const songModel = computed(() => props.type === 'song' ? storeModel.value as SongModel | undefined : undefined)

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
  await $api(`${apiPath}/${id}`, { method: 'POST' })
  refresh()
  submitting.value = false
}

async function reject(id: number) {
  submitting.value = true
  await $api(`${apiPath}/${id}`, { method: 'DELETE' })
  refresh()
  submitting.value = false
}
</script>
