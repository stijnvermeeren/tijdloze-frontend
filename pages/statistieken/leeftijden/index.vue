<template lang="pug">
ui-data-table(:data="data" total-name="Gemiddeld")
</template>

<script setup>
import _ from 'lodash'
import {useRootStore} from "~/stores/root";

const cutoffs = [3, 10, 20, 50, 100]

const data = computed(() => {
  const years = useRootStore().years;
  const songs = useRootStore().songs;

  return cutoffs.map(cutoff => {
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
      total: displayAverage(agesSum, sizeSum),
      perYear: Object.fromEntries(
        cutoffData.map(yearData => [
          yearData.year.yyyy,
          displayAverage(yearData.sum, yearData.size)
        ])
      )
    }
  });
})

function displayAverage(sum, size) {
  return size === 0 ? '-' : Math.round(sum / size * 10) / 10
}
</script>
