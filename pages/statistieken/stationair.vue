<template lang="pug">
  div
    h2 Stationaire nummers in de Tijdloze
    tijdloze-tabs(:tabs="[\
      { to: '/statistieken/stationair', title: 'Per jaar' },\
      { to: '/statistieken/stationair/meerderejaren', title: 'Meerdere jaren op rij' },\
      { to: '/statistieken/stationair/grafiek', title: 'Op grafiek' }\
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
    },
    head: {
      title: 'Stationaire nummers'
    }
  }
</script>
