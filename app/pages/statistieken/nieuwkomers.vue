<template lang="pug">
Title Nieuwkomers
div
  h2 Tijdloze nieuwkomers
  ui-tabs(:tabs="tabs")
    nuxt-page(:data='data' :years='years')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/pages/statistieken/songYearEntry'

const tabs = [
  { to: '/statistieken/nieuwkomers', title: 'Per jaar' },
  { to: '/statistieken/nieuwkomers/lijst', title: 'Hoogste aller tijden' },
  { to: '/statistieken/nieuwkomers/grafiek', title: 'Op grafiek' }
]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed<SongYearEntry[]>(() => {
  const dataPoints: SongYearEntry[] = [];
  const allYears = years.value
  const firstTijdlozeYear = allYears[0]
  if (!firstTijdlozeYear) {
    return dataPoints
  }
  songs.value.forEach(song => {
    const firstYear = allYears.find(year => song.position(year));
    if (firstYear && !firstYear.equals(firstTijdlozeYear)) {
      const position = song.position(firstYear)
      dataPoints.push({
        song: song,
        year: firstYear,
        position: position!
      });
    }
  });
  return dataPoints;
})

definePageMeta({
  noScrollDepth: 2
})
</script>
