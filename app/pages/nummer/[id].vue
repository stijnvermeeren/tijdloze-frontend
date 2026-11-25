<template lang="pug">
Title {{song.title}} ({{song.artist.name}})
.container
  div.flexTitle
    page-title(icon='song' icon-alt='Nummer')
      h2 {{song.title}}
    ui-admin-link-btn(:to="`/admin/song/${song.id}`") Admin: nummer aanpassen

  div Nummer van
    = " "
    strong #[song-artist-link(:song='song')]
  div Origineel op album
    = " "
    strong
      album-link(:album='song.album')
      span.ml-2  ({{ song.album.releaseYear }})

  ui-tabs(:tabs="tabs")
    nuxt-page(keepalive :song="song" :full-song-data="fullSongData")

  .media-embeds(v-if='fullSongData?.spotifyId || fullSongData?.youtubeVideoId')
    .media-embed(v-if='fullSongData?.spotifyId')
      spotify(:spotify-id='fullSongData.spotifyId')
    .media-embed(v-if='fullSongData?.youtubeVideoId')
      iframe.youtube(
        :src='`https://www.youtube.com/embed/${encodeURIComponent(fullSongData.youtubeVideoId)}`'
        title='YouTube video player'
        width='352'
        height='198'
        allowfullscreen
        loading='lazy'
      )
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import { idFromSlug } from '~/utils/slug'
import Song from "~/orm/Song";
import {useRepo} from "pinia-orm";

const routeId = useRouteParam('id') || ''
const songId = computed(() => idFromSlug(routeId))

const {data: fullSongData, error, status} = await useApiFetch(
  () => apiEndpoints.song.byId(Number(songId.value)), { lazy: true }
)

const {currentYear, years} = storeToRefs(useYearStore())

const song = computed<Song>(() => {
  const foundSong = useRepo(Song).withAll().find(songId.value)

  if (!foundSong) {
    throw createError({ statusCode: 404, statusMessage: 'Pagina niet gevonden' })
  }

  return foundSong
})
const tabs = computed(() => {
  const prefix = `/nummer/${songId.value}-${song.value.slug}`
  const tabs = [
    { to: prefix, title: `In de Tijdloze` },
    { to: `${prefix}/grafiek`, title: 'Op grafiek' }
  ]
  if (fullSongData.value?.lyrics) {
    tabs.push({ to: `${prefix}/lyrics`, title: 'Lyrics' })
  }
  tabs.push({ to: `${prefix}/info`, title: 'Info' })
  return tabs
})

definePageMeta({
  noScrollDepth: 2
})
</script>

<style scoped>
  div.media-embeds {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
    align-items: center;
    gap: 16px;
    margin-top: 30px;

    .media-embed {
      width: min(352px, 100%);

      :deep(iframe) {
        width: 100%;
        max-width: 100%;
      }

      iframe.youtube {
        display: block;
        aspect-ratio: 16 / 9;
        height: auto;
      }
    }
  }
</style>
