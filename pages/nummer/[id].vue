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

  div.links
    ui-external-link-btn(v-for='(link, index) in links' :key='index' :href='link.href') {{ link.title }}

  ui-alert(v-if='fullSongData.notes')
    make-links(:text='fullSongData.notes')

  .spotify(v-if='fullSongData.spotifyId')
    div
      spotify(:spotify-id='fullSongData.spotifyId')

  ui-tabs(:tabs="tabs")
    nuxt-page(:song="song" :lyrics="fullSongData.lyrics")
</template>

<script setup>
import { idFromSlug } from '~/utils/slug'
import Song from "@/orm/Song";
import {useRepo} from "pinia-orm";

const songId = computed(() => idFromSlug(useRoute().params?.id))

const {data: fullSongData, error} = await useFetch(
    `song/${songId.value}`, useFetchOpts({'key': `song/${songId.value}`})
)
if (error.value) {
  create404Error()
}

const {currentYear, years} = storeToRefs(useYearStore())

const song = computed(() => {
  return useRepo(Song).withAll().find(songId.value);
})
const links = computed(() => {
  const links = [];
  const addLink = (property, title) => {
    if (fullSongData.value[property]) {
      links.push({
        href: fullSongData.value[property],
        title: title
      })
    }
  };

  addLink('urlWikiEn', 'Wikipedia (Engels)');
  addLink('urlWikiNl', 'Wikipedia (Nederlands)');
  return links;
})

const tabs = computed(() => {
  const tabs = [
      { to: `/nummer/${songId.value}`, title: `In de Tijdloze van ${currentYear.value.yyyy}` },
      { to: `/nummer/${songId.value}/noteringen`, title: `Alle noteringen` }
  ]
  if (song.value.listCount(years.value) > 0) {
    tabs.push({ to: `/nummer/${songId.value}/grafiek`, title: 'Op grafiek', subtitle: "top 100" })
  }
  if (fullSongData.value.lyrics) {
    tabs.push({ to: `/nummer/${songId.value}/lyrics`, title: 'Lyrics' })
  }
  return tabs
})
</script>

<style lang="scss" scoped>
  .links {
    margin-top: 10px;
    margin-bottom: 20px;

    a {
      margin: 0 5px;
    }
  }

  div.spotify {
    margin-bottom: 20px;

    div {
      text-align: center;

      iframe {
        max-width: 80%;
      }
    }
  }
</style>
