<template lang="pug">
Title Stationaire nummers
div
  h2 Stationaire nummers in de Tijdloze
  ui-tabs(:tabs="[\
    { to: '/statistieken/stationair', title: 'Per jaar' },\
    { to: '/statistieken/stationair/meerderejaren', title: 'Meerdere jaren op rij' },\
    { to: '/statistieken/stationair/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script setup>
import _ from 'lodash';

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed(() => {
  const dataPoints = [];
  songs.value.forEach(song => {
    _.drop(years.value, 1).forEach((year, index) => {
      const previousYear = years.value[index]
      if (song.position(year) && song.position(year) === song.position(previousYear)) {
        dataPoints.push({
          song: song,
          year: year
        });
      }
    });
  });
  return dataPoints;
})
</script>
