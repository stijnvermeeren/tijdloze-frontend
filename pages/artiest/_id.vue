<template lang="pug">
  div
    div.flexTitle
      page-title(icon='artist' icon-alt='Artiest')
        h2 {{artist.fullName}}
      div(v-if="$store.getters['auth/isAdmin']")
        nuxt-link(:to="`/admin/artist/${artist.id}`")
          el-button(type="warning" round size="small") Admin: artist aanpassen

    div.links
      nuxt-link(:to='`/database?type=artiesten&land=${artist.countryId}`')
        el-button(size="small" round)
          tijdloze-country-icon(:country-id='artist.countryId' :include-name="true")
      a(v-for='(link, index) in links' :key='index' :href='link.href')
        el-button(size="mini" round icon="el-icon-link") {{ link.title }}

    el-alert(v-if='fullArtistData.notes' :closable="false" show-icon)
      make-links(:text='fullArtistData.notes')

    el-card
      div.header(slot="header")
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
            tijdloze-album(:album='album')
            |  ({{album.releaseYear}})
            ul(v-if='album.songsSorted.length')
              li(v-for='song in album.songsSorted' v-if="song.artistId === artist.id || song.secondArtistId === artist.id")
                song-with-second-artist-link(:song='song' :artist="artist")

    el-card(v-if='top100Songs.length')
      div.header(slot="header")
        div
          div.title Grafiek
      graph(:songs='top100Songs')
</template>

<script>
  import _ from 'lodash'
  import PageTitle from '~/components/PageTitle'
  import Graph from '../../components/d3/Graph'
  import EntryCount from '../../components/EntryCount'
  import MakeLinks from '../../components/MakeLinks'
  import InCurrentList from '../../components/InCurrentList'
  import SongWithSecondArtistLink from "../../components/SongWithSecondArtistLink";
  import { idFromSlug } from '~/utils/slug'
  import Artist from "@/orm/Artist";

  export default {
    components: {
      SongWithSecondArtistLink,
      InCurrentList,
      MakeLinks,
      EntryCount,
      Graph,
      PageTitle
    },
    data() {
      return {
        tab: 'tijdloze'
      }
    },
    computed: {
      artist() {
        return Artist.query()
          .withAll()
          .with('albums.songs')
          .with('albums.songs.secondArtist')
          .with('songs.album')
          .with('songs.secondArtist')
          .with('secondarySongs.artist')
          .with('secondarySongs.album.songs.artist')
          .find(this.fullArtistData.id);
      },
      top100Songs() {
        return this.artist.allSongs.filter(song => song.listCount(this.$store.getters.years) > 0)
      },
      currentYear() {
        return this.$store.getters.currentYear;
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
      }
    },
    async asyncData({ params, app }) {
      return {
        fullArtistData: await app.$axios.$get(`artist/${idFromSlug(params.id)}`)
      };
    },
    head() {
      return {
        title: this.artist.fullName
      }
    }
  }
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
