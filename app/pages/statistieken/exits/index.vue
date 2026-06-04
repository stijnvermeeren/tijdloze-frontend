<template lang="pug">
statistics-year-songs-table(
  :list-data='listData'
  count-label-singular='exit'
  count-label-plural='exits'
)
  template(#positionAnnotation='{entry}')
    position-annotation in {{entry.year.yyyy}}
</template>

<script setup lang="ts">
import { sortBy } from 'ramda';
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
  const previousYear = useYearStore().context.forYear(year).previous?.year
  return sortBy((entry: SongYearEntry) => entry.song.position(entry.year)!)(
    props.data.filter((entry: SongYearEntry) => previousYear && entry.year.equals(previousYear))
  );
}
</script>
