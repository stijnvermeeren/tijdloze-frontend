<template lang="pug">
Title Stationaire nummers
div
  h2 Stationaire nummers in de Tijdloze
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/pages/statistieken/songYearEntry'

const tabs = [
  { to: '/statistieken/stationair', title: 'Per jaar' },
  { to: '/statistieken/stationair/meerderejaren', title: 'Meerdere jaren op rij' },
  { to: '/statistieken/stationair/grafiek', title: 'Op grafiek' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<SongYearEntry[]>(() => {
  const dataPoints: SongYearEntry[] = [];
  const allYears = years.value
  songs.value.forEach(song => {
    allYears.slice(1).forEach((year, index) => {
      const previousYear = allYears[index]!
      const position = song.position(year)
      if (position && position === song.position(previousYear)) {
        dataPoints.push({
          song: song,
          year: year,
          position: position
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
