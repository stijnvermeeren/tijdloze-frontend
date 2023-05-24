<template lang="pug">
div.container
  table(v-if='filteredAndSorted.length')
    tbody
      tr
        th.previous
          year-link(:year='previousYear')
        th.current
          year-link(:year='currentYear')
        th.song
      tr(v-for='song in filteredAndSorted' :key='song.id' :class="{ top100: song.probablyInList(currentYear) }")
        td.previous
          position(:year='previousYear' :song='song')
        td.current
          position-change(:year='currentYear' :song='song')
          position(:year='currentYear' :song='song')
        td.song
          song-with-second-artist-link(:song='song' :artist='artist')
  div(v-else)
    | Geen nummers in de top 100 van #[year-link(:year='currentYear')].
</template>

<script>
  import _ from 'lodash'
  import Artist from "../orm/Artist";

  export default {
    name: 'InCurrentList',
    props: {
      songs: Array,
      artist: Artist
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      },
      filteredAndSorted() {
        const filtered = this.songs.filter(song => song.position(this.currentYear, true) || song.position(this.previousYear, true));
        return _.sortBy(
          filtered,
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

  table {
    table-layout: fixed;
    margin: 0 10% 10px;

    td, th {
      &.previous {
        font-weight: normal;
        font-size: 14px;
        text-align: center;
        width: 50px;
      }

      &.current {
        text-align: center;
        width: 80px;
      }

      &.song {
        text-align: left;
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
  }
</style>
