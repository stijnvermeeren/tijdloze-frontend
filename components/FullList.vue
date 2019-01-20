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
              tijdloze-artist(:artist='song.artist')
            td
              tijdloze-song(:song='song')
            td.releaseYear
              | {{song.album.releaseYear}}
      .collapseLink(v-if='collapsable' @click.prevent='toggle()')
        div(v-if='collapsed')
          a Toon de hele lijst
        div(v-else)
          a Minder tonen
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
      }
    },
    data() {
      return {
        collapsed: true
      }
    },
    computed: {
      collapsable() {
        return this.songs.length > 10
      },
      shownSongs() {
        if (this.collapsable && this.collapsed) {
          return _.take(this.songs, 10);
        } else {
          return this.songs;
        }
      }
    },
    methods: {
      toggle() {
        this.collapsed = !this.collapsed;
        if (this.collapsed) {
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
