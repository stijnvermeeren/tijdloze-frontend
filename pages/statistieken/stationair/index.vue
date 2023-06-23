<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l Stationaire nummers
    tr(v-for='{year, entries} in listData')
      td.r
        year-link(:year='year')
      td {{entries.length}}
      td
        table.valueSong(v-if='entries.length')
          tbody
            tr(v-for='entry in entries')
              td {{entry.song.position(entry.year)}}
              td.l
                song-with-cover(:song='entry.song')
        div(v-else) /
</template>

<script>
  import _ from 'lodash'

  export default {
    props: {
      data: Array,
      years: Array
    },
    computed: {
      listData() {
        const listYears = _.reverse(_.drop(this.years, 1));
        return listYears.map(year => {
          return {
            year,
            entries: this.entriesPerYear(year)
          }
        })
      }
    },
    methods: {
      entriesPerYear(year) {
        return _.sortBy(
          this.data.filter(entry => entry.year.equals(year)),
          entry => entry.song.position(entry.year)
        );
      }
    }
  }
</script>
