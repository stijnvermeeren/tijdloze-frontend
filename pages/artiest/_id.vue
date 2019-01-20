<template lang="pug">
  div
    page-title(icon='artist' icon-alt='Artiest')
      h2 {{artist.fullName}}
    table.info
      tbody
        tr
          th Land
          td
            tijdloze-country-icon(:country='country')  {{country.name}}
        tr
          th In de Tijdloze
          td
            in-current-list(:songs='artist.songs')
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
      entry-count(:songs='artist.songs')
    graph(
      v-if='artist.songs.find(song => song.listCount($store.getters.years) > 0)'
      :songs='artist.songs'
    )

    h3 Tijdloze albums en nummers
    div
      ul(v-if='artist.albums')
        li(v-for='album in artist.albums')
          tijdloze-album(:album='album')
          |  ({{album.releaseYear}})
          ul(v-if='album.songs')
            li(v-for='song in album.songs')
              tijdloze-song(:song='song')
</template>

<script>
  import _ from 'lodash'
  import PageTitle from '~/components/PageTitle'
  import Graph from '../../components/d3/Graph'
  import EntryCount from '../../components/EntryCount'
  import MakeLinks from '../../components/MakeLinks'
  import InCurrentList from '../../components/InCurrentList'

  export default {
    components: {
      InCurrentList,
      MakeLinks,
      EntryCount,
      Graph,
      PageTitle
    },
    computed: {
      artist() {
        return this.$store.getters['entities/artists']().withAllRecursive(2).find(this.fullArtistData.id);
      },
      songs() {
        return _.sortBy(
          this.artist.songs,
          song => [song.album.releaseYear, song.title]
        )
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
        fullArtistData: await app.$axios.$get(`artist/${params.id}`)
      };
    },
    head() {
      return {
        title: this.artist.fullName
      }
    }
  }
</script>


