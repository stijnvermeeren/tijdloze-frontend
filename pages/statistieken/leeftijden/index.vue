<template lang="pug">
ui-data-table(:data="data" total-name="Gemiddeld")
</template>

<script setup>
import _ from 'lodash'

const cutoffs = [3, 10, 20, 50, 100]

const {songs} = storeToRefs(useRootStore())
const {years} = storeToRefs(useYearStore())

const data = computed(() => {
  return cutoffs.map(cutoff => {
    const cutoffData = years.value.map(year => {
      const ages = [];

      songs.value.forEach(song => {
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
