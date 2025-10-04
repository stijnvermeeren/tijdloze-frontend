<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th
        table.valueSongValue
          tbody
            tr
              th Pos.
              th.l Nummer
              th Definitief
    tr(v-for='year in listYears')
      td.r
        year-link(:year='year')
      td {{entriesPerYear(year).length}}
      td
        table.valueSongValue(v-if='entriesPerYear(year).length')
          tbody
            tr(v-for='entry in entriesPerYear(year)')
              td {{entry.song.position(entry.year)}}
              td.l
                song-with-cover(:song='entry.song')
              td
                template(v-if='entry.isFinal') *
        div(v-else) /
</template>

<script setup>
import { sortBy } from 'ramda';

const props = defineProps({
  data: Array,
  years: Array
})

const listYears = computed(() => {
  return props.years.slice(1, -1).reverse();
})

function entriesPerYear(year) {
  return sortBy(entry => entry.song.position(entry.year))(
    props.data.filter(entry => entry.year.equals(year))
  );
}
</script>
