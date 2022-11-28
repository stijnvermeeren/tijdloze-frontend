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
      tr(v-for='year in listYears')
        td.r
          tijdloze-year(:year='year')
        td {{entriesPerYear(year).length}}
        td
          table.valueDataDataValue(v-if='entriesPerYear(year).length')
            tbody
              tr(v-for='entry in entriesPerYear(year)')
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
    props: ['data', 'years'],
    computed: {
      listYears() {
        return _.reverse(_.drop(this.years, 2));
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
