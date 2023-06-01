<template lang="pug">
Title Dalers
div
  h2 Tijdloze dalers
  tabs(:tabs="[\
    { to: '/statistieken/dalers', title: 'Per jaar' },\
    { to: '/statistieken/dalers/lijst', title: 'Grootste aller tijden' }\
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
            const oldPosition = song.position(year.previous());
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
      }
    }
  }
</script>
