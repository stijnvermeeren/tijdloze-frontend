<template lang="pug">
  div
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
  import SongLink from './SongLink'
  import PositionChange from './PositionChange'
  import Position from './Position'
  import YearLink from './YearLink'
  import SongWithSecondArtistLink from "./SongWithSecondArtistLink";

  export default {
    name: 'InCurrentList',
    components: {SongWithSecondArtistLink, YearLink, Position, PositionChange, SongLink},
    props: ['songs', 'artist'],
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      },
      filteredAndSorted() {
        const filtered = this.songs.filter(song => song.probablyInList(this.currentYear, true));
        return _.sortBy(
          filtered,
          [song => this.sortPosition(song, this.currentYear, 1), song => this.sortPosition(song, this.previousYear, 501)]
        )
      }
    },
    methods: {
      sortPosition(song, year, defaultValue) {
        const position = song.position(year, true);
        return position > 0 ? position : defaultValue;
      }
    }
  }
</script>

<style lang="less" scoped>
  table {
    table-layout: fixed;

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
