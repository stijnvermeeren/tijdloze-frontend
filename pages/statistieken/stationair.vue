<template lang="pug">
Title Stationaire nummers
div
  h2 Stationaire nummers in de Tijdloze
  tabs(:tabs="[\
    { to: '/statistieken/stationair', title: 'Per jaar' },\
    { to: '/statistieken/stationair/meerderejaren', title: 'Meerdere jaren op rij' },\
    { to: '/statistieken/stationair/grafiek', title: 'Op grafiek' }\
  ]")
    nuxt-page(:data='data' :years='years')
</template>

<script>
import _ from 'lodash';
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
          _.drop(this.years, 1).forEach(year => {
            if (song.position(year) && song.position(year) === song.position(year.previous())) {
              dataPoints.push({
                song: song,
                year: year
              });
            }
          });
        });
        return dataPoints;
      }
    }
  }
</script>
