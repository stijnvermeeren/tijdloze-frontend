<template lang="pug">
  div
    div(v-if='songs.length')
      table.lijst(ref='list')
        tbody
          tr
            th.n(v-if='year.previous()')
              nuxt-link(:to='`/lijst/${year.previous().yyyy}`') {{year.previous()._yy}}
            th.r {{year._yy}}
            th.n(v-if='year.next()')
              nuxt-link(:to='`/lijst/${year.next().yyyy}`') {{year.next()._yy}}
            th.a
              nuxt-link(to='/artiesten') Artiest
            th
              nuxt-link(to='/nummers') Titel
            th.releaseYear
              | Jaar
          tr(v-for='song in shownSongs' :key='song.id' :class='{lineAfter: song.position(year, true) % 5 === 0}')
            td.n(v-if='year.previous()')
              tijdloze-position(:song='song' :year='year.previous()')
            td.r
              tijdloze-position-change(:song='song' :year='year')
              tijdloze-position(:song='song' :year='year')
            td.n(v-if='year.next()')
              tijdloze-position(:song='song' :year='year.next()')
            td.a
              tijdloze-song-artist(:song='song')
            td
              tijdloze-song(:song='song')
            td.releaseYear
              | {{song.album.releaseYear}}
      .collapseLink(v-if='length > 10')
        div(v-if='length > 10 && limit != 10' @click.prevent='limit = 10')
          a Toon top 10
        div(v-if='length > 100 && limit != 100' @click.prevent='limit = 100')
          a Toon top 100
        div(v-if='length > 10 && limit != length' @click.prevent='limit = length')
          a Toon alle {{length}} nummers
    p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script>
  import _ from 'lodash'

  export default {
    name: 'FullList',
    props: {
      year: {
        type: Object
      },
      songs: {
        type: Array
      },
      initialLimit: {
        type: Number,
        default: 10
      }
    },
    data() {
      return {
        limit: this.initialLimit
      }
    },
    computed: {
      length() {
        return this.songs.length
      },
      shownSongs() {
        return _.take(this.songs, this.limit);
      }
    },
    watch: {
      limit(newValue, oldValue) {
        if (newValue < oldValue) {
          const element = this.$refs['list'];
          console.log(element)
          element.scrollIntoView({block: "start"});
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  div.collapseLink {
    text-align: center;
    font-weight: bold;
  }

  .releaseYear {
    @media (max-width: 660px) {
      display: none;
    }
  }
</style>
