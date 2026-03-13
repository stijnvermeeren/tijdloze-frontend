<template lang="pug">
Title Stijgers
div
  h2 Tijdloze stijgers
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type RiseEntry = { song: Song; year: Year; oldPosition: number; newPosition: number }

const tabs = [
  { to: '/statistieken/stijgers', title: 'Per jaar' },
  { to: '/statistieken/stijgers/lijst', title: 'Grootste aller tijden' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<RiseEntry[]>(() => {
  const dataPoints: RiseEntry[] = [];
  const allYears = years.value
  songs.value.forEach(song => {
    allYears.slice(1).forEach((year, index) => {
      const previousYear = allYears[index]
      if (!previousYear) {
        return
      }
      const oldPosition = song.position(previousYear);
      const newPosition = song.position(year);
      if (oldPosition && newPosition && oldPosition > newPosition) {
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
