<template lang="pug">
Title Nieuwkomers
div
  h2 Tijdloze nieuwkomers
  ui-tabs(:tabs="[\
    { to: '/statistieken/nieuwkomers', title: 'Per jaar' },\
    { to: '/statistieken/nieuwkomers/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/nieuwkomers/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const years = computed(() => {
  return useRootStore().years;
})
const songs = computed(() => {
  return useRootStore().songs;
})
const data = computed(() => {
  const dataPoints = [];
  const firstTijdlozeYear = years.value[0];
  songs.value.forEach(song => {
    const firstYear = years.value.find(year => song.position(year));
    if (firstYear && !firstYear.equals(firstTijdlozeYear)) {
      dataPoints.push({
        song: song,
        year: firstYear
      });
    }
  });
  return dataPoints;
})
</script>
