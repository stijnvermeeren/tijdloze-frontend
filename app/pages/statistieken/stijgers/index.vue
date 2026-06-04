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
import type Year from '~/orm/Year'
import type { ChangeEntry } from '~/types/statistieken/changeEntry'

const props = defineProps<{ data: ChangeEntry[]; years: Year[] }>()

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

function entriesPerYear(year: Year): ChangeEntry[] {
  return sortWith<ChangeEntry>([
    ascend((entry: ChangeEntry) => entry.newPosition - entry.oldPosition),
    ascend((entry: ChangeEntry) => entry.newPosition)
  ])(props.data.filter((entry: ChangeEntry) => entry.year.equals(year)));
}
</script>
