<template lang="pug">
  div
    table(v-if='song.probablyInList(currentYear, true)')
      tbody
        tr
          th.previous
            year-link(:year='previousYear')
          th.current
            year-link(:year='currentYear')
        tr
          td.previous
            position(:year='previousYear' :song='song')
          td.current
            position-change(:year='currentYear' :song='song')
            position(:year='currentYear' :song='song')
    div(v-else)
      | Niet in de top 100 van #[year-link(:year='currentYear')].
</template>

<script>
  import PositionChange from './PositionChange'
  import Position from './Position'
  import YearLink from './YearLink'

  export default {
    name: 'InCurrentListSong',
    components: {YearLink, Position, PositionChange},
    props: ['song'],
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      previousYear() {
        return this.currentYear.previous();
      }
    }
  }
</script>

<style lang="less" scoped>
  table {
    table-layout: fixed;
    width: auto;
    margin: 0 auto 0 0;

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
    }
  }
</style>
