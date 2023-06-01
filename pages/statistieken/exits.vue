<template lang="pug">
Title Exits
div
  h2 Tijdloze exits
  tabs(:tabs="[\
    { to: '/statistieken/exits', title: 'Per jaar' },\
    { to: '/statistieken/exits/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/exits/grafiek', title: 'Op grafiek' }\
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
          let inPreviousList = false;
          this.years.forEach(year => {
            if (inPreviousList && song.notInList(year)) {
              dataPoints.push({
                song: song,
                year: year.previous()
              });
            }

            inPreviousList = song.position(year) > 0;
          });
        });
        return dataPoints;
      }
    }
  }
</script>
