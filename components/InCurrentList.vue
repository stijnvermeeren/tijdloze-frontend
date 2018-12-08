<template>
  <div>
    <table v-if="filteredAndSorted.length">
      <tbody>
        <tr>
          <th class="previous"><year-link :year="previousYear" /></th>
          <th class="current"><year-link :year="currentYear" /></th>
          <th class="song"></th>
        </tr>
        <tr v-for="song in filteredAndSorted" :key="song.id">
          <td class="previous"><position :year="previousYear" :song="song" /></td>
          <td class="current">
            <position-change :year="currentYear" :song="song" />
            <position :year="currentYear" :song="song" />
          </td>
          <td class="song"><song-link :song="song" /></td>
        </tr>
      </tbody>
    </table>
    <div v-else>
      Geen nummers in de Tijdloze van <year-link :year="currentYear" />.
    </div>
  </div>
</template>

<script>
  import _ from 'lodash'
  import SongLink from './SongLink'
  import PositionChange from './PositionChange'
  import Position from './Position'
  import YearLink from './YearLink'

  export default {
    name: 'InCurrentList',
    components: {YearLink, Position, PositionChange, SongLink},
    props: ['songs'],
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      },
      filteredAndSorted() {
        const filtered = this.songs.filter(song => song.possiblyInList(this.currentYear));
        return _.sortBy(
          filtered,
          [song => this.sortPosition(song, this.currentYear), song => this.sortPosition(song, this.previousYear)]
        )
      }
    },
    methods: {
      sortPosition(song, year) {
        const position = song.position(year);
        return position > 0 ? position : 151;
      }
    }
  }
</script>

<style lang="less" scoped>
  table {
    table-layout: fixed;

    th {
      font-weight: normal;
    }

    td, th {
      &.previous {
        font-size: 14px;
        text-align: center;
        width: 50px;
      }

      &.current{
        font-weight: bold;
        text-align: center;
        width: 80px;
      }

      &.song {
        text-align: left;
        font-weight: bold;
      }
    }
  }
</style>
