<template lang="pug">
span
  span(v-if='listCount')
    | {{listCount}} {{listCount > 1 ? 'noteringen' : 'notering' }} in de top 100
    | ({{inListSummary}})
  span(v-else) Geen top-100 noteringen
</template>

<script setup>
import {probablyInListIntervals} from '~/utils/intervals'
import _ from 'lodash'

const props = defineProps({
  songs: Array
})

const {years} = storeToRefs(useYearStore())

const listCount = computed(() => {
  return _.sumBy(props.songs, song => song.listCount(years.value))
})
const inListSummary = computed(() => {
  const intervalSummaries = probablyInListIntervals(props.songs, years.value).map(interval => {
    const first = _.first(interval);
    const last = _.last(interval);
    if (last.isCurrent()) {
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
