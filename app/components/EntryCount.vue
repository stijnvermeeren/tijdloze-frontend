<template lang="pug">
span
  span(v-if='listCount')
    | {{listCount}} {{listCount > 1 ? 'noteringen' : 'notering' }} in de top 100
    | ({{inListSummary}})
  span(v-else) Geen top-100 noteringen
</template>

<script setup>
import {probablyInListIntervals} from '~/utils/intervals'

const props = defineProps({
  songs: Array
})

const {years, currentYear} = storeToRefs(useYearStore())

const listCount = computed(() => {
  return props.songs.reduce((sum, song) => {
    return sum + song.listCount(years.value)
  }, 0)
})
const inListSummary = computed(() => {
  const intervalSummaries = probablyInListIntervals(props.songs, years.value).map(interval => {
    const first = interval[0];
    const last = interval[interval.length - 1];
    if (last.equals(currentYear.value)) {
      return `${first.yyyy}-...`
    } else if (first.equals(last)) {
      return first.yyyy
    } else {
      return `${first.yyyy}-${last._yy}`
    }
  });
  return intervalSummaries.join(", ");
})
</script>

<style scoped>

</style>
