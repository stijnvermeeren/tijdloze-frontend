<template lang="pug">
  div
    h2 Tijdloze nieuwkomers
    tijdloze-tabs(:tabs="[\
      { to: '/statistieken/nieuwkomers', title: 'Per jaar' },\
      { to: '/statistieken/nieuwkomers/lijst', title: 'Hoogste aller tijden' },\
      { to: '/statistieken/nieuwkomers/grafiek', title: 'Op grafiek' }\
    ]")
      nuxt-child(:data='data' :years='years')

</template>

<script>
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
    },
    head: {
      title: 'Nieuwkomers'
    }
  }
</script>
