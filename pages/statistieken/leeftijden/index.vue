<template lang="pug">
ui-data-table(:data="data" total-name="Gemiddeld")
</template>

<script>
  import _ from 'lodash'
  import {useRootStore} from "~/stores/root";

  export default {
    data() {
      return {
        cutoffs: [3, 10, 20, 50, 100]
      }
    },
    computed: {
      years() {
        return useRootStore().years;
      },
      data() {
        const years = this.years;
        const songs = useRootStore().songs;

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
            entry: `Top ${cutoff}`,
            total: this.displayAverage(agesSum, sizeSum),
            perYear: Object.fromEntries(
              cutoffData.map(yearData => [
                yearData.year.yyyy,
                this.displayAverage(yearData.sum, yearData.size)
              ])
            )
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
