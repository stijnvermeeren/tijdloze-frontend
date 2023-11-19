<template lang="pug">
tr.album(v-if="album")
  td(colspan="3")
    album-link(:album="album")
    |  ({{album.releaseYear}})
tr(v-for='song in sortedSongs' :key='song.id' :class="{ top100: song.probablyInList(currentYear) }")
  td.previous
    position-main(:year='currentYear.previous' :song='song' single-line)
  td.current
    position-change(:year='currentYear' :song='song' single-line)
  td.song
    song-with-second-artist-link(:song='song' :artist='artist')
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
        return _.sortBy(
          this.songs,
          [
            song => this.sortBlock(song),
            song => song.position(this.currentYear, true),
            song => song.position(this.previousYear, true)
          ]
        )
      }
    },
    methods: {
      sortBlock(song) {
        const yearPosition = song.position(this.currentYear, true);
        const previousYearPosition = song.position(this.previousYear, true)

        if (!yearPosition && previousYearPosition && previousYearPosition <= 100) {
          // songs that are probably still in the top 100
          return 1;
        } else if (yearPosition) {
          // songs that are already in the list
          return 2;
        } else {
          return 3;
        }
      },
      sortPosition(song, year, defaultValue) {
        const position = song.position(year, true);
        return position > 0 ? position : defaultValue;
      }
    }
  }
</script>

<style lang="scss" scoped>
tr.album {
  td {
    padding-top: 5px;
    a {
      font-weight: bold;
    }
  }
}

tr.top100 > td {
  &.current {
    font-weight: bold;
    text-align: center;
    width: 80px;
  }

  &.song {
    font-weight: bold;
    text-align: left;
  }
}
</style>