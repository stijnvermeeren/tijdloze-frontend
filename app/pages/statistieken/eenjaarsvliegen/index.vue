<template lang="pug">
statistics-year-songs-table(
  :list-data='listData'
  songs-table-class='valueSongValue'
)
  template(#songsHeader)
    table.valueSongValue
      tbody
        tr
          th Pos.
          th.l Nummer
          th Definitief
  template(#extraCell='{entry}')
    td
      template(v-if='entry.isFinal') *
</template>

<script setup lang="ts">
import { sortBy } from 'ramda';
import type Year from '~/orm/Year'
import type { OneHitEntry } from '~/types/statistieken/oneHitEntry'

const props = defineProps<{ data: OneHitEntry[]; years: Year[] }>()

const listData = computed(() => {
  const listYears = props.years.slice(1, -1).reverse();
  return listYears.map(year => {
    return {
      year,
      entries: entriesPerYear(year)
    }
  })
})

function entriesPerYear(year: Year): OneHitEntry[] {
  return sortBy((entry: OneHitEntry) => entry.song.position(entry.year)!)(
    props.data.filter((entry: OneHitEntry) => entry.year.equals(year))
  );
}
</script>
