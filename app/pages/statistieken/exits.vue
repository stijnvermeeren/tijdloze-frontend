<template lang="pug">
Title Exits
div
  h2 Tijdloze exits
  ui-tabs(:tabs="[\
    { to: '/statistieken/exits', title: 'Per jaar' },\
    { to: '/statistieken/exits/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/exits/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script setup>
import _ from 'lodash'

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed(() => {
  const dataPoints = [];
  songs.value.forEach(song => {
    let inPreviousList = false;
    _.drop(years.value, 1).forEach((year, index) => {
      const previousYear = years.value[index]
      if (inPreviousList && song.notInList(year)) {
        dataPoints.push({
          song: song,
          year: previousYear
        });
      }

      inPreviousList = song.position(year) > 0;
    });
  });
  return dataPoints;
})

definePageMeta({
  noScrollDepth: 2
})
</script>
