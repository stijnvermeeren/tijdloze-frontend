<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Aantal jaren
      th
        table.valueValueSong
          tr
            th.i Jaren
            th.i Positie
            th.l Nummer
    tr(v-for='data in byNumberOfYears')
      td.r {{data.numberOfYears}}
      td
        table.valueValueSong
          tbody
            tr(v-for='entry in data.entries')
              td.i
                | {{entry.years[0].yyyy}}-{{entry.years[entry.years.length - 1].yyyy}}
              td.i
                | {{entry.song.position(entry.years[0])}}
              td.l
                song-with-cover(:song='entry.song')
</template>

<script setup>
import _ from 'lodash';

const props = defineProps({
  years: Array
})

const songs = computed(() => {
  return useRootStore().songs;
})
const byNumberOfYears = computed(() => {
  let data = [];
  let maxYears = 0;
  songs.value.forEach(song => {
    song.stationaryIntervals(useYearStore().years)
      .filter(interval => interval.length > 2)
      .map(interval => {
        maxYears = Math.max(maxYears, interval.length);
        data.push({
          song,
          years: interval,
          position: song.position(interval[0])
        });
      })
  });

  return _.rangeRight(3, maxYears + 1).map(numberOfYears => {
    const entries = _.sortBy(
      data.filter(item => item.years.length === numberOfYears),
      [data => -data.years[0].yyyy, data => data.song.position(data.years[0])]
    );

    return {numberOfYears, entries};
  });
})
</script>
