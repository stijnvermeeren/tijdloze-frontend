<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l Nieuwkomers
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
import type Year from '~/orm/Year'
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

const props = defineProps<{ data: SongYearEntry[]; years: Year[] }>()

const listData = computed(() => {
  const listYears = props.years.slice(1).reverse();
  return listYears.map(year => {
    return {
      year,
      entries: entriesPerYear(year)
    }
  })
})

function entriesPerYear(year: Year): SongYearEntry[] {
  return sortBy((entry: SongYearEntry) => entry.song.position(entry.year)!)(
    props.data.filter((entry: SongYearEntry) => entry.year.equals(year))
  );
}
</script>
