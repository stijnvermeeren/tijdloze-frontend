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
    strong #[album-link(:album='song.album')] ({{ song.album.releaseYear }})

  div.links
    ui-external-link-btn(v-for='(link, index) in links' :key='index' :href='link.href') {{ link.title }}

  ui-alert(v-if='fullSongData.notes')
    make-links(:text='fullSongData.notes')

  .spotify(v-if='fullSongData.spotifyId')
    div
      spotify(:spotify-id='fullSongData.spotifyId')

  ui-card(v-if='fullSongData.lyrics' :collapse-height="80" title="Lyrics")
    .lyrics {{ fullSongData.lyrics }}

  ui-card(v-else-if="fullSongData.languageId === 'i'" title="Lyrics")
    div (Instrumentaal nummer)
    .clear

  ui-card(title="In de Tijdloze")
    template(#subtitle)
      entry-count(:songs='[song]')
    .allPositions
      template(v-for='(interval, index) in intervals')
        div(v-if='index' :key="index")
          div ...
          div
        div(v-for='year in interval' :key='year.yyyy')
          div.year
            year-link(:year='year' short)
          div
            position-with-change(:song='song' :year='year')


  ui-card(v-if='song.listCount(years) > 0' title="Grafiek")
    d3-graph(:songs='[song]' :no-label='true')
</template>

<script setup>
import {allEntriesIntervals, probablyInListIntervals} from '~/utils/intervals'
import { idFromSlug } from '~/utils/slug'
import Song from "@/orm/Song";
import {useRootStore} from "~/stores/root";
import {useRepo} from "pinia-orm";

const {data: fullSongData, error} = await useFetch(
    `song/${idFromSlug(useRoute().params.id)}`, useFetchOpts()
)
if (error.value) {
  create404Error()
}

const song = computed(() => {
  return useRepo(Song).withAll().find(fullSongData.value.id);
})
const years = computed(() => {
  return useRootStore().years;
})
const currentYear = computed(() => {
  return useRootStore().currentYear;
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

const intervals = computed(() => {
  return allEntriesIntervals([song.value], years.value, true);
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

  div.allPositions {
    text-align: center;
    display: flex;
    flex-wrap: wrap;

    > div {
      margin: 12px 12px;
      min-width: 45px;
      display: flex;
      flex-direction: column;

      > div {

      }
    }
  }

  div.lyrics {
    padding: 0 20px 10px 20px;
    white-space: pre-line;
    font-style: italic;
    font-size: 14px;
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
