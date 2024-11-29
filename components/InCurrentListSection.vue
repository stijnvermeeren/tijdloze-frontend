<template lang="pug">
song-with-position(v-for='song in sortedSongs' :key='song.id' :song="song" :year="currentYear")
</template>

<script>
  import _ from 'lodash'
  import {useRootStore} from "~/stores/root";

  export default {
    name: 'InCurrentList',
    props: {
      songs: Array,
      artist: Object,
      album: Object
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      previousYear() {
        return this.currentYear.previous;
      },
      sortedSongs() {
        // Only show songs linked to the current artist (in case this album is actually from a different artist)
        const songs = this.artist ? (
            this.songs.filter(song => song.artistId === this.artist.id || song.secondArtistId === this.artist.id)
        ) : this.songs
        return _.sortBy(
          songs,
          [
            song => song.position(this.currentYear, true),
            song => song.position(this.previousYear, true)
          ]
        )
      }
    }
  }
</script>

<style lang="scss" scoped>
</style>