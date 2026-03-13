<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th.r Jaar
      th Aantal
      th.l(colspan='3') Grootste stijger
    tr(v-for='{year, entries, topEntry} in listData')
      td.r
        year-link(:year='year')
      td {{entries.length}}
      td(v-if='topEntry')
        | {{topEntry.oldPosition - topEntry.newPosition}} posities
      td.i(v-if='topEntry')
        | {{topEntry.oldPosition}} &rarr; {{topEntry.newPosition}}
      td.l(v-if='topEntry')
        song-with-cover(:song='topEntry.song')
      td.l(v-if='!topEntry' colspan='4')
        | /
</template>

<script setup lang="ts">
import { sortWith, ascend } from 'ramda';
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type RiseEntry = { song: Song; year: Year; oldPosition: number; newPosition: number }

const props = defineProps<{ data: RiseEntry[]; years: Year[] }>()

const listData = computed(() => {
  const listYears = props.years.slice(1).reverse()
  return listYears.map(year => {
    const entries = entriesPerYear(year);
    return {
      year,
      entries,
      topEntry: entries?.[0]
    }
  })
})

function entriesPerYear(year: Year): RiseEntry[] {
  return sortWith<RiseEntry>([
    ascend((entry: RiseEntry) => entry.newPosition - entry.oldPosition),
    ascend((entry: RiseEntry) => entry.newPosition)
  ])(props.data.filter((entry: RiseEntry) => entry.year.equals(year)));
}
</script>
