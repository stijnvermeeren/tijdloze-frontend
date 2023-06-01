<template lang="pug">
Title {{artist.fullName}}
div
  div.flexTitle
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.fullName}}
    div(v-if="isAdmin")
      nuxt-link(:to="`/admin/artist/${artist.id}`")
        el-button(type="warning" round size="small") Admin: artist aanpassen

  div.links
    nuxt-link(:to='`/database?type=artiesten&land=${artist.countryId}`')
      el-button(size="small" round)
        country-icon(:country-id='artist.countryId' :include-name="true")
    a(v-for='(link, index) in links' :key='index' :href='link.href')
      el-button(size="small" round)
        el-icon
          el-icon-link
        span {{ link.title }}

  el-alert(v-if='fullArtistData.notes' :closable="false" show-icon)
    make-links(:text='fullArtistData.notes')

  el-card
    template(#header)
      div.header
        div
          div.title In de Tijdloze
          div.subtitle
            entry-count(:songs='artist.allSongs')
        div
          el-radio-group(v-model="tab" size="small")
            el-radio-button(label='tijdloze') Tijdloze {{currentYear.yyyy}}
            el-radio-button(label='album') Per album
    div(v-if="tab === 'tijdloze'")
      in-current-list(:songs='artist.allSongs' :artist='artist')
    div(v-if="tab === 'album'")
      ul(v-if='artist.allAlbums')
        li(v-for='album in artist.allAlbums')
          album-link(:album='album')
          |  ({{album.releaseYear}})
          ul(v-if='album.songsSorted.length')
            template(v-for='song in album.songsSorted' key='song.id')
              li(v-if="song.artistId === artist.id || song.secondArtistId === artist.id")
                song-with-second-artist-link(:song='song' :artist="artist")

  el-card(v-if='top100Songs.length')
    template(#header)
      div.header
        div
          div.title Grafiek
    graph(:songs='top100Songs')
</template>

<script>
  import Graph from '../../components/d3/Graph'
  import { idFromSlug } from '~/utils/slug'
  import Artist from "@/orm/Artist";
  import {useRootStore} from "~/stores/root";
  import {useAuthStore} from "~/stores/auth";
  import {useRepo} from "pinia-orm";

  export default defineNuxtComponent({
    components: {
      Graph
    },
    data() {
      return {
        tab: 'tijdloze'
      }
    },
    computed: {
      artist() {
        return useRepo(Artist)
          .with('albums', q1 => q1
            .with('songs', q2 => q2
              .with('secondArtist')))
          .with('songs', q1 => q1
            .with('album')
            .with('secondArtist'))
          .with('secondarySongs', q1 => q1
            .with('artist')
            .with('album', q2 => q2
              .with('songs', q3 => q3
                .with('artist'))))
          .find(this.fullArtistData.id);
      },
      top100Songs() {
        return this.artist.allSongs.filter(song => song.listCount(useRootStore().years) > 0)
      },
      currentYear() {
        return useRootStore().currentYear;
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullArtistData[property]) {
            links.push({
              href: this.fullArtistData[property],
              title: title
            })
          }
        };

        addLink('urlOfficial', 'Officiële website');
        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        addLink('urlAllMusic', 'AllMusic');
        return links;
      },
      isAdmin() {
        return useAuthStore().isAdmin;
      }
    },
    async asyncData() {
      const {data: fullArtistData} = await useApiFetch(`artist/${idFromSlug(useRoute().params.id)}`)
      return {fullArtistData}
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
</style>
