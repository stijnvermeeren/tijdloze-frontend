<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l(colspan='3') Grootste daler
    tr(v-for='{year, entries, topEntry} in listData')
      td.r
        year-link(:year='year')
      td
        | {{entries.length}}
      td(v-if='topEntry')
        | {{topEntry.newPosition - topEntry.oldPosition}} posities
      td.i(v-if='topEntry')
        | {{topEntry.oldPosition}} &rarr; {{topEntry.newPosition}}
      td.l(v-if='topEntry')
        song-with-cover(:song='topEntry.song')
      td.l(v-if='!topEntry' colspan='4')
        | /
</template>

<script setup>
import { sortWith, ascend } from 'ramda'

const props = defineProps({
  data: Array,
  years: Array
})

const listData = computed(() => {
  const listYears = props.years.slice(1).reverse();
  return listYears.map(year => {
    const entries = entriesPerYear(year);
    return {
      year,
      entries,
      topEntry: entries?.[0]
    }
  })
})

function entriesPerYear(year) {
  return sortWith([
    ascend(entry => entry.oldPosition - entry.newPosition),
    ascend(entry => entry.newPosition)
  ])(
    props.data.filter(entry => entry.year.equals(year))
  );
}
</script>
