<template lang="pug">
Title Dalers
div
  h2 Tijdloze dalers
  ui-tabs(:tabs="[\
    { to: '/statistieken/dalers', title: 'Per jaar' },\
    { to: '/statistieken/dalers/lijst', title: 'Grootste aller tijden' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script setup>
import _ from 'lodash';
import {useRootStore} from "~/stores/root";

const years = computed(() => {
  return useRootStore().years;
})
const songs = computed(() => {
  return useRootStore().songs;
})
const data = computed(() => {
  const dataPoints = [];
  songs.value.forEach(song => {
    _.drop(years.value, 1).forEach(year => {
      const oldPosition = song.position(year.previous);
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
</script>
