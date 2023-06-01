<template lang="pug">
div
  div.fullList(v-if='songs.length > 0')
    div.entry.header
      div.n(v-if='year.previous()')
        nuxt-link(:to='`/lijst/${year.previous().yyyy}`') {{year.previous()._yy}}
      div.r {{year.yyyy}}
      div.n(v-if='year.next()')
        nuxt-link(:to='`/lijst/${year.next().yyyy}`') {{year.next()._yy}}
      div.a Artiest
      div.s Titel
      div.releaseYear
        | Jaar
    div.content(v-if='songs.length > 20')
      div.wrapper
        | {{ songs }}
        //- RecycleScroller.scroller(:items="songs" :item-size="24" key-field="id" :buffer="40" v-slot="{ item }")
          full-list-entry(:song="item" :year="year")
    div(v-else)
      full-list-entry(v-for="song in songs" :key="song.id" :song="song" :year="year")

  p(v-else) Nog geen nummers in de Tijdloze van {{year.yyyy}}.
</template>

<script>
  import Year from "../orm/Year";

  export default {
    name: 'FullList',
    props: {
      year: {
        type: Year
      },
      songs: {
        type: Array
      }
    }
  }
</script>

<style lang="scss">
  div.content {
    flex: 100% 1 1;
    position: relative;
    height: 400px;

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
