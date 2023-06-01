<template lang="pug">
Title Nieuwkomers
div
  h2 Tijdloze nieuwkomers
  tabs(:tabs="[\
    { to: '/statistieken/nieuwkomers', title: 'Per jaar' },\
    { to: '/statistieken/nieuwkomers/lijst', title: 'Hoogste aller tijden' },\
    { to: '/statistieken/nieuwkomers/grafiek', title: 'Op grafiek' }\
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
        const firstTijdlozeYear = this.years[0];
        this.songs.forEach(song => {
          const firstYear = this.years.find(year => song.position(year));
          if (firstYear && !firstYear.equals(firstTijdlozeYear)) {
            dataPoints.push({
              song: song,
              year: firstYear
            });
          }
        });
        return dataPoints;
      }
    }
  }
</script>
