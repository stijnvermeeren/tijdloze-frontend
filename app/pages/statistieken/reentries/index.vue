<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l
        table.valueSongValue
          tbody
            tr
              th Pos.
              th.l Nummer
              th Afwezigheid
    tr(v-for='{year, entries} in listData')
      td.r
        year-link(:year='year')
      td {{entries.length}}
      td
        table.valueSongValue(v-if='entries.length')
          tbody
            tr(v-for='entry in entries')
              td {{entry.song.position(entry.year)}}
              td.l
                song-with-cover(:song='entry.song')
              td.text-no-wrap
                | {{entry.absenceYears}} jaar
        div(v-else) /
</template>

<script setup>
import { sortBy } from 'ramda';

const props = defineProps({
  data: Array,
  years: Array
})

const listData = computed(() => {
  const listYears = props.years.slice(2).reverse()
  return listYears.map(year => {
    return {
      year,
      entries: entriesPerYear(year)
    }
  })
})

function entriesPerYear(year) {
  return sortBy(entry => entry.song.position(entry.year))(
    props.data.filter(entry => entry.year.equals(year))
  );
}
</script>
