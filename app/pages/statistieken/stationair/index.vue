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

<script setup lang="ts">
import { sortBy } from 'ramda'
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type StationaryEntry = { song: Song; year: Year }

const props = defineProps<{ data: StationaryEntry[]; years: Year[] }>()

const listData = computed(() => {
  const listYears = props.years.slice(1).reverse()
  return listYears.map(year => {
    return {
      year,
      entries: entriesPerYear(year)
    }
  })
})

function entriesPerYear(year: Year): StationaryEntry[] {
  return sortBy((entry: StationaryEntry) => entry.song.position(entry.year) ?? Number.MAX_SAFE_INTEGER)(
    props.data.filter((entry: StationaryEntry) => entry.year.equals(year))
  );
}
</script>
