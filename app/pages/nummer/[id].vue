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

  .spotify(v-if='fullSongData?.spotifyId')
    div
      spotify(:spotify-id='fullSongData.spotifyId')
</template>

<script setup>
import { idFromSlug } from '~/utils/slug'
import Song from "~/orm/Song";
import {useRepo} from "pinia-orm";

const songId = computed(() => idFromSlug(useRoute().params?.id))

const {data: fullSongData, error, status} = await useLazyFetch(
    `song/${songId.value}`, useFetchOpts({'key': `song/${songId.value}`})
)

const {currentYear, years} = storeToRefs(useYearStore())

const song = computed(() => {
  return useRepo(Song).withAll().find(songId.value);
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

<style lang="scss" scoped>
  div.spotify {
    margin-top: 30px;

    div {
      text-align: center;

      iframe {
        max-width: 80%;
      }
    }
  }
</style>
