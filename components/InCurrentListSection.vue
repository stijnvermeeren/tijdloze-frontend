<template lang="pug">
song-with-position(v-for='song in sortedSongs' :key='song.id' :song="song" :year="currentYear")
</template>

<script>
  import _ from 'lodash'
  import {useRootStore} from "~/stores/root";

  export default {
    name: 'InCurrentList',
    props: {
      songs: Array
    },
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      previousYear() {
        return this.currentYear.previous;
      },
      sortedSongs() {
        return _.sortBy(
          this.songs,
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