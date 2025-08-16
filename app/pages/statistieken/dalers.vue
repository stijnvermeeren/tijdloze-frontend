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

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed(() => {
  const dataPoints = [];
  songs.value.forEach(song => {
    _.drop(years.value, 1).forEach((year, index) => {
      const previousYear = years.value[index]
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
