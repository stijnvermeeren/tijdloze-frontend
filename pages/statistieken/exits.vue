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
const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed(() => {
  const dataPoints = [];
  songs.value.forEach(song => {
    let inPreviousList = false;
    years.value.forEach(year => {
      if (inPreviousList && song.notInList(year)) {
        dataPoints.push({
          song: song,
          year: year.previous
        });
      }

      inPreviousList = song.position(year) > 0;
    });
  });
  return dataPoints;
})
</script>
