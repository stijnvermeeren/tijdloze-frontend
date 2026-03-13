<template lang="pug">
  in-current-list(:songs='[song]')

  h4.mt-4 Alle noteringen
  entry-count(:songs='[song]')
  .allPositions
    template(v-for='(interval, index) in intervals')
      div(v-if='index' :key="index")
        div ...
        div
      div(v-for='year in interval' :key='year.yyyy')
        div.year
          year-link(:year='year' short)
        div
          position-with-change(:song='song' :year='year')
</template>

<script setup lang="ts">
import {allEntriesIntervals} from "~/utils/intervals";
import type Song from '~/orm/Song'

const props = defineProps<{ song: Song }>()

const {years} = storeToRefs(useYearStore())

const intervals = computed(() => {
  return allEntriesIntervals([props.song], years.value, true);
})
</script>

<style scoped>
div.allPositions {
  text-align: center;
  display: flex;
  flex-wrap: wrap;

  > div {
    margin: 12px 12px;
    min-width: 45px;
    display: flex;
    flex-direction: column;
  }
}
</style>
