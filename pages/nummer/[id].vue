<template lang="pug">
Title {{song.title}} ({{song.artist.fullName}})
.container
  div.flexTitle
    page-title(icon='song' icon-alt='Nummer')
      h2 {{song.title}}
    div(v-if="isAdmin")
      nuxt-link(:to="`/admin/song/${song.id}`")
        el-button(type="warning" round size="small") Admin: nummer aanpassen

  div Nummer van
    = " "
    strong #[song-artist-link(:song='song')]
  div Origineel op album
    = " "
    strong #[album-link(:album='song.album')] ({{ song.album.releaseYear }})

  div.links
    a(v-for='(link, index) in links' :key='index' :href='link.href')
      el-button(size="small" round icon="el-icon-link") {{ link.title }}

  el-alert(v-if='fullSongData.notes' :closable="false" show-icon)
    make-links(:text='fullSongData.notes')

  .spotify(v-if='fullSongData.spotifyId')
    div
      spotify(:spotify-id='fullSongData.spotifyId')

  lyrics(v-if='fullSongData.lyrics')
    .lyrics {{ fullSongData.lyrics }}

  el-card(v-else-if="fullSongData.languageId === 'ins'")
    div.header(slot="header")
      div.title Lyrics
    div (Instrumentaal nummer)
    .clear

  el-card
    div.header(slot="header")
      div
        div.title In de Tijdloze
        div.subtitle
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
            position-change(:song='song' :year='year')
            position(:song='song' :year='year')


  el-card(v-if='song.listCount(years) > 0')
    div.header(slot="header")
      div
        div.title Grafiek
    tijdloze-graph(:songs='[song]' :no-label='true')
</template>

<script>
  import Graph from '~/components/d3/Graph'
  import {probablyInListIntervals} from '~/utils/intervals'
  import { idFromSlug } from '~/utils/slug'
  import Song from "@/orm/Song";
  import {useRootStore} from "~/stores/root";
  import {useAuthStore} from "~/stores/auth";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    components: {
      TijdlozeGraph: Graph
    },
    computed: {
      song() {
        return useRepo(Song).withAll().find(this.fullSongData.id);
      },
      years() {
        return useRootStore().years;
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullSongData[property]) {
            links.push({
              href: this.fullSongData[property],
              title: title
            })
          }
        };

        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        return links;
      },
      intervals() {
        return probablyInListIntervals([this.song], this.years, true);
      },
      isAdmin() {
        return useAuthStore().isAdmin;
      }
    },
    async asyncData() {
      const {data: fullSongData} = await useApiFetch(`song/${idFromSlug(useRoute().params.id)}`)
      return {fullSongData}
    }
  })
</script>

<style lang="scss" scoped>
  .links {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    margin-top: 10px;
    margin-bottom: 20px;

    a {
      margin: 0 5px;
    }
  }

  .el-alert {
    margin-top: 10px;
    margin-bottom: 20px;
  }

  .el-radio-group {
    text-align: right;
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
