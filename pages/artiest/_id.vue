<template lang="pug">
  div
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.fullName}}
    table.info
      tbody
        tr(v-if="artist.countryId")
          th Land
          td
            tijdloze-country-icon(:country-id='artist.countryId' :include-name="true")
        tr
          th In de Tijdloze
          td
            in-current-list(:songs='artist.allSongs' :artist='artist')
        tr.unimportant(v-if='links.length')
          th Externe links
          td
            div(v-for='(link, index) in links' :key='index')
              a(:href='link.href') {{ link.title }}
        tr.unimportant(v-if='fullArtistData.notes')
          td(colspan='2')
            make-links(:text='fullArtistData.notes')

    el-card
      div.header(slot="header")
        div
          div.title In de Tijdloze
          div.subtitle
            entry-count(:songs='artist.allSongs')
      graph(
        v-if='top100Songs.length'
        :songs='top100Songs'
      )

    el-card
      div.header(slot="header")
        div.title Tijdloze albums en nummers
      div
        ul(v-if='artist.allAlbums')
          li(v-for='album in artist.allAlbums')
            tijdloze-album(:album='album')
            |  ({{album.releaseYear}})
            ul(v-if='album.songsSorted.length')
              li(v-for='song in album.songsSorted' v-if="song.artistId === artist.id || song.secondArtistId === artist.id")
                song-with-second-artist-link(:song='song' :artist="artist")
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
    computed: {
      artist() {
        return Artist.query()
          .withAll()
          .with('albums.songs')
          .with('albums.songs.secondArtist')
          .with('songs.album')
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


