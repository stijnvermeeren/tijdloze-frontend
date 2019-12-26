<template lang="pug">
  table.lijst.perVijf
    tbody
      tr
        th.r Jaar
        th Aantal
        th.l(colspan='4') Grootste daler
      tr(v-for='year in listYears')
        td.r
          tijdloze-year(:year='year')
        td
          | {{entriesPerYear(year).length}}
        td(v-if='topEntry(year)')
          | {{topEntry(year).newPosition - topEntry(year).oldPosition}} posities
        td.i(v-if='topEntry(year)')
          | {{topEntry(year).oldPosition}} &rarr; {{topEntry(year).newPosition}}
        td.a(v-if='topEntry(year)')
          tijdloze-song-artist(:song='topEntry(year).song')
        td(v-if='topEntry(year)')
          tijdloze-song(:song='topEntry(year).song')
        td.l(v-if='!topEntry(year)' colspan='4')
          | /
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
          this.data.filter(entry => entry.year.equals(year)),
          [entry => entry.oldPosition - entry.newPosition, entry => entry.newPosition]
        );
      },
      topEntry(year) {
        return _.first(this.entriesPerYear(year));
      }
    }
  }
</script>
