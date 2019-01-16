<template lang="pug">
  table.lijst.perEen
    tbody
      tr
        th.r Jaar
        th Aantal
        th.l Exits
      tr(v-for='year in listYears')
        td.r
          tijdloze-year(:year='year')
        td {{entriesPerYear(year).length}}
        td
          table.valueDataData(v-if='entriesPerYear(year).length')
            tbody
              tr(v-for='entry in entriesPerYear(year)')
                td {{entry.song.position(entry.year)}}
                td.a
                  tijdloze-artist(:artist='entry.song.artist')
                td
                  tijdloze-song(:song='entry.song')
          div(v-else='') /
</template>

<script>
  import _ from 'lodash'

  export default {
    props: ['data', 'years'],
    computed: {
      listYears() {
        return _.reverse(_.drop(this.years, 1));
      }
    },
    methods: {
      entriesPerYear(year) {
        return _.sortBy(
          this.data.filter(entry => entry.year.equals(year.previous())),
          entry => entry.song.position(entry.year)
        );
      }
    }
  }
</script>
