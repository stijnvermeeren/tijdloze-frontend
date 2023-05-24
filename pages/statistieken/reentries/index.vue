<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l
        table.valueDataDataValue
          tbody
            tr
              th Pos.
              th.a Artiest
              th Nummer
              th Afwezigheid
    tr(v-for='{year, entries} in listData')
      td.r
        tijdloze-year(:year='year')
      td {{entries.length}}
      td
        table.valueDataDataValue(v-if='entries.length')
          tbody
            tr(v-for='entry in entries')
              td {{entry.song.position(entry.year)}}
              td.a
                tijdloze-song-artist(:song='entry.song')
              td
                tijdloze-song(:song='entry.song')
              td
                | {{entry.absenceYears}} jaar
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
        const listYears = _.reverse(_.drop(this.years, 2));
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
