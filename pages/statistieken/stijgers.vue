<template lang="pug">
Title Stijgers
div
  h2 Tijdloze stijgers
  ui-tabs(:tabs="[\
    { to: '/statistieken/stijgers', title: 'Per jaar' },\
    { to: '/statistieken/stijgers/lijst', title: 'Grootste aller tijden' }\
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
      const oldPosition = song.position(years.value[index]);
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
</script>
