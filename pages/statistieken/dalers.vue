<template lang="pug">
  div
    h2 Tijdloze dalers
    tijdloze-tabs(:tabs="[\
      { to: '/statistieken/dalers', title: 'Per jaar' },\
      { to: '/statistieken/dalers/lijst', title: 'Grootste aller tijden' }\
    ]")
      nuxt-child(:data='data' :years='years')

</template>

<script>
  import _ from 'lodash';

  export default {
    computed: {
      years() {
        return this.$store.getters.years;
      },
      songs() {
        return this.$store.getters.songs;
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
    },
    head: {
      title: 'Dalers'
    }
  }
</script>
