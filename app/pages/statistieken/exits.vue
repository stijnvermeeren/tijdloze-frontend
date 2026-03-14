<template lang="pug">
Title Exits
div
  h2 Tijdloze exits
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/pages/statistieken/songYearEntry'

const tabs = [
  { to: '/statistieken/exits', title: 'Per jaar' },
  { to: '/statistieken/exits/lijst', title: 'Hoogste aller tijden' },
  { to: '/statistieken/exits/grafiek', title: 'Op grafiek' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<SongYearEntry[]>(() => {
  const dataPoints: SongYearEntry[] = [];
  const allYears = years.value
  songs.value.forEach(song => {
    let inPreviousList = false;
    allYears.slice(1).forEach((year, index) => {
      const previousYear = allYears[index]!
      if (inPreviousList && song.notInList(year)) {
        dataPoints.push({
          song: song,
          year: previousYear
        });
      }

      inPreviousList = song.position(year) !== undefined
    });
  });
  return dataPoints;
})

definePageMeta({
  noScrollDepth: 2
})
</script>
