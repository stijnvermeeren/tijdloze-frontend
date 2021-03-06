<template lang="pug">
  div
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.fullName}}
    table.info
      tbody
        tr(v-if="country")
          th Land
          td
            tijdloze-country-icon(:country='country' :include-name="true")
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

    h3 In de Tijdloze
    div
      entry-count(:songs='artist.allSongs')
    graph(
      v-if='top100Songs.length'
      :songs='top100Songs'
    )

    h3 Tijdloze albums en nummers
    div
      ul(v-if='artist.allAlbums')
        li(v-for='album in artist.allAlbums')
          tijdloze-album(:album='album')
          |  ({{album.releaseYear}})
          ul(v-if='album.songsSorted.length')
            li(v-for='song in album.songsSorted')
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
        return this.$store.getters['entities/artists']()
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
      country() {
        return this.$store.getters.countriesById[this.artist.countryId];
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


