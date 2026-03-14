<template lang="pug">
div
  h2 Tijdloze Re-entries
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type { ReentryEntry } from './reentries/reentryEntry'

const tabs = [
  { to: '/statistieken/reentries', title: 'Per jaar' },
  { to: '/statistieken/reentries/lijst', title: 'Hoogste aller tijden' },
  { to: '/statistieken/reentries/grafiek', title: 'Op grafiek' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<ReentryEntry[]>(() => {
  const dataPoints: ReentryEntry[] = [];
  const allYears = years.value
  songs.value.forEach(song => {
    let hasPreviousEntry = false;
    let absenceYears = 0;

    allYears.forEach(year => {
      if (hasPreviousEntry && absenceYears > 0 && song.position(year) !== undefined) {
        dataPoints.push({
          song: song,
          year: year,
          absenceYears: absenceYears
        });
      }

      if (song.position(year) !== undefined) {
        hasPreviousEntry = true;
        absenceYears = 0;
      } else {
        absenceYears++;
      }
    });
  });
  return dataPoints;
})

useHead({
  title: 'Re-entries'
})

definePageMeta({
  noScrollDepth: 2
})
</script>
