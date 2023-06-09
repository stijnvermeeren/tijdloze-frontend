<template lang="pug">
div
  h2 Tijdloze Re-entries
  ui-tabs(:tabs="[\
    { to: '/statistieken/reentries', title: 'Per jaar' },\
    { to: '/statistieken/reentries/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/reentries/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script>
  import {useRootStore} from "~/stores/root";

  export default {
    computed: {
      years() {
        return useRootStore().years;
      },
      songs() {
        return useRootStore().songs;
      },
      data() {
        const dataPoints = [];
        this.songs.forEach(song => {
          let hasPreviousEntry = false;
          let absenceYears = 0;

          this.years.forEach(year => {
            if (hasPreviousEntry && absenceYears > 0 && song.position(year) > 0) {
              dataPoints.push({
                song: song,
                year: year,
                absenceYears: absenceYears
              });
            }

            if (song.position(year) > 0) {
              hasPreviousEntry = true;
              absenceYears = 0;
            } else {
              absenceYears++;
            }
          });
        });
        return dataPoints;
      }
    },
    head: {
      title: 'Re-entries'
    }
  }
</script>
