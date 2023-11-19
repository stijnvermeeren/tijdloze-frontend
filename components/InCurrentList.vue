<template lang="pug">
div.container
  table(v-if='(songs && songs.length) || (albums && albums.length)')
    tbody
      tr
        th.previous
          year-link(:year='previousYear')
        th.current
          year-link(:year='currentYear')
        th.song
      template(v-if="albums")
        template(v-for="album in albums")
          in-current-list-section(:album='album' :songs="album.songs" :artist="artist")
      template(v-if="songs")
        in-current-list-section(:songs='songs' :artist="artist")
  div(v-else)
    | Nog geen nummers in de Tijdloze.
</template>

<script>
  import _ from 'lodash'
  import Artist from "../orm/Artist";
  import {useRootStore} from "~/stores/root";

  export default {
    name: 'InCurrentList',
    props: {
      songs: Array,
      albums: Array,
      artist: Artist
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      previousYear() {
        return this.currentYear.previous;
      }
    }
  }
</script>

<style lang="scss" scoped>

  table {
    table-layout: fixed;
    margin: 0 20px;

    :deep(td), th {
      &.previous {
        text-align: center;
        width: 80px;

        span.position {
          font-weight: normal;
          color: #444;
          font-size: 80%;
        }
      }

      &.current {
        text-align: center;
        width: 120px;
      }

      &.song {
        text-align: left;
      }
    }
  }
</style>
