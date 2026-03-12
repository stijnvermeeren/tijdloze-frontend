<template lang="pug">
span
  span(v-if='listCount')
    | {{listCount}} {{listCount > 1 ? 'noteringen' : 'notering' }} in de top 100
    | ({{inListSummary}})
  span(v-else) Geen top-100 noteringen
</template>

<script setup lang="ts">
import {probablyInListIntervals} from '~/utils/intervals'
import type Song from '~/orm/Song'

const props = defineProps<{
  songs: Song[]
}>()

const {years, currentYear} = storeToRefs(useYearStore())

const listCount = computed(() => {
  return props.songs.reduce((sum, song) => {
    return sum + song.listCount(years.value)
  }, 0)
})
const inListSummary = computed(() => {
  const intervalSummaries = probablyInListIntervals(props.songs, years.value, false).map(interval => {
    const first = interval[0];
    const last = interval[interval.length - 1];
    if (!first || !last || !currentYear.value) {
      return '';
    }
    if (last.equals(currentYear.value)) {
      return `${first.yyyy}-...`
    } else if (first.equals(last)) {
      return first.yyyy
    } else {
      return `${first.yyyy}-${last._yy}`
    }
  }).filter(Boolean);
  return intervalSummaries.join(", ");
})
</script>

<style scoped>

</style>
