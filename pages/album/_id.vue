<template lang="pug">
  div
    page-title(icon='album' icon-alt='Album')
      h2 {{album.title}}
    table.info
      tbody
        tr.important
          th Album van
          td
            tijdloze-artist(:artist='album.artist')
        tr
          th Uitgebracht in
          td {{ album.releaseYear }}
        tr
          th In de Tijdloze
          td
            in-current-list(:songs='album.songs')
        tr.unimportant(v-if='links.length')
          th Externe links
          td
            div(v-for='(link, index) in links' :key='index')
              a(:href='link.href') {{ link.title }}

    h3 In de Tijdloze
    div
      entry-count(:songs='album.songs')
    graph(v-if='album.songs.find(song => song.listCount($store.getters.years) > 0)' :songs='album.songs')

    h3 Tijdloze nummers
    div
      ul(v-if='album.songs')
        li(v-for='song in album.songs')
          song-with-second-artist-link(:song='song')
</template>

<script>
  import PageTitle from '~/components/PageTitle'
  import Graph from '../../components/d3/Graph'
  import EntryCount from '../../components/EntryCount'
  import InCurrentList from '../../components/InCurrentList'
  import SongWithSecondArtistLink from "../../components/SongWithSecondArtistLink";
  import { idFromSlug } from '~/utils/slug'

  export default {
    components: {
      SongWithSecondArtistLink,
      InCurrentList,
      EntryCount,
      Graph,
      PageTitle
    },
    computed: {
      album() {
        return this.$store.getters['entities/albums']()
          .withAll()
          .with('songs.album')
          .with('songs.secondArtist')
          .find(this.fullAlbumData.id);
      },
      currentYear() {
        return this.$store.getters.currentYear;
      },
      links() {
        const links = [];
        const addLink = (property, title) => {
          if (this.fullAlbumData[property]) {
            links.push({
              href: this.fullAlbumData[property],
              title: title
            })
          }
        };

        addLink('urlWikiEn', 'Wikipedia (Engels)');
        addLink('urlWikiNl', 'Wikipedia (Nederlands)');
        addLink('urlAllMusic', 'AllMusic');
        return links;
      }
    },
    async asyncData({ params, app }) {
      return {
        fullAlbumData: await app.$axios.$get(`album/${idFromSlug(params.id)}`)
      };
    },
    head() {
      return {
        title: `${this.album.title} (${this.album.artist.fullName})`
      }
    }
  }
</script>
