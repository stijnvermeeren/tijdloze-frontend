<template lang="pug">
statistics-year-songs-table(
  :list-data='listData'
  songs-table-class='valueSongValue'
  header-class='l'
)
  template(#songsHeader)
    table.valueSongValue
      tbody
        tr
          th Pos.
          th.l Nummer
          th Afwezigheid
  template(#extraCell='{entry}')
    td.text-no-wrap
      | {{entry.absenceYears}} jaar
</template>

<script setup lang="ts">
import { sortBy } from 'ramda';
import type Year from '~/orm/Year'
import type { ReentryEntry } from '~/types/statistieken/reentryEntry'

const props = defineProps<{ data: ReentryEntry[]; years: Year[] }>()

const listData = computed(() => {
  const listYears = props.years.slice(2).reverse()
  return listYears.map(year => {
    return {
      year,
      entries: entriesPerYear(year)
    }
  })
})

function entriesPerYear(year: Year): ReentryEntry[] {
  return sortBy((entry: ReentryEntry) => entry.song.position(entry.year)!)(
    props.data.filter((entry: ReentryEntry) => entry.year.equals(year))
  );
}
</script>
