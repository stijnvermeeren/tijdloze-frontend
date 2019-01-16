<template lang="pug">
  .scrollbox
    table.lijst
      tbody
        tr
          th.r
          th(v-for='year in years') {{year._yy}}
          th.r Algemeen
        tr(v-for='{cutoff, cutoffData, overallSum, overallSize} in data')
          td.r
            | Top {{cutoff}}
          td(v-for='{sum, size} in cutoffData')
            | {{displayAverage(sum, size)}}
          td.r
            | {{displayAverage(overallSum, overallSize)}}
</template>

<script>
  import _ from 'lodash'

  export default {
    data() {
      return {
        cutoffs: [3, 10, 20, 50, 100]
      }
    },
    computed: {
      years() {
        return this.$store.getters.years;
      },
      data() {
        const years = this.years;
        const songs = this.$store.getters.songs;

        return this.cutoffs.map(cutoff => {
          const cutoffData = years.map(year => {
            const ages = [];

            songs.forEach(song => {
              if (song.position(year) && song.position(year) <= cutoff) {
                ages.push(year.yyyy - song.album.releaseYear);
              }
            });

            return {
              year: year,
              size: ages.length,
              sum: _.sum(ages)
            }
          });

          const agesSum = _.sumBy(cutoffData, yearData => yearData.sum);
          const sizeSum = _.sumBy(cutoffData, yearData => yearData.size);

          return {
            cutoff: cutoff,
            cutoffData: cutoffData,
            overallSum: agesSum,
            overallSize: sizeSum
          }
        });
      }
    },
    methods: {
      displayAverage(sum, size) {
        return size === 0 ? '-' : Math.round(sum / size * 10) / 10
      }
    }
  }
</script>
