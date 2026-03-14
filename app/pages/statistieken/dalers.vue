<template lang="pug">
Title Dalers
div
  h2 Tijdloze dalers
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type { DropEntry } from './dalers/dropEntry'

const tabs = [
  { to: '/statistieken/dalers', title: 'Per jaar' },
  { to: '/statistieken/dalers/lijst', title: 'Grootste aller tijden' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<DropEntry[]>(() => {
  const dataPoints: DropEntry[] = [];
  const allYears = years.value
  songs.value.forEach(song => {
    allYears.slice(1).forEach((year, index) => {
      const previousYear = allYears[index]
      if (!previousYear) {
        return
      }
      const oldPosition = song.position(previousYear);
      const newPosition = song.position(year);
      if (oldPosition && newPosition && oldPosition < newPosition) {
        dataPoints.push({
          song,
          year,
          oldPosition,
          newPosition
        });
      }
    });
  });
  return dataPoints;
})

definePageMeta({
  noScrollDepth: 2
})
</script>
