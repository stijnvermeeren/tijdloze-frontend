<template lang="pug">
  div
    div(v-if='songs.length > 0')
      div.entry.header
        div.n(v-if='year.previous()')
          nuxt-link(:to='`/lijst/${year.previous().yyyy}`') {{year.previous()._yy}}
        div.r {{year.yyyy}}
        div.n(v-if='year.next()')
          nuxt-link(:to='`/lijst/${year.next().yyyy}`') {{year.next()._yy}}
        div.a
          nuxt-link(to='/artiesten') Artiest
        div.s
          nuxt-link(to='/nummers') Titel
        div.releaseYear
          | Jaar
      div.content(v-if='songs.length > 20')
        div.wrapper
          RecycleScroller.scroller(:items="songs" :item-size="24" key-field="id" :buffer="40")
            template(v-slot="{ item }")
              full-list-entry(:song="item" :year="year")
      div(v-else)
        full-list-entry(v-for="song in songs" :key="song.id" :song="song" :year="year")

    p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script>
  import FullListEntry from "./FullListEntry";

  export default {
    name: 'FullList',
    components: {
      FullListEntry
    },
    props: {
      year: {
        type: Object
      },
      songs: {
        type: Array
      }
    }
  }
</script>

<style lang="less">
  div.content {
    flex: 100% 1 1;
    position: relative;
    height: 512px;

    .wrapper {
      overflow: hidden;
      position: absolute;
      top: 0;
      bottom: 0;
      left: 0;
      right: 0;

      .scroller {
        width: 100%;
        height: 100%;
      }
    }
  }
</style>
