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
import sortWith from 'ramda/src/sortWith'
import ascend from 'ramda/src/ascend'

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

  return [...Array(maxYears + 1).keys()].slice(3).reverse().map(numberOfYears => {
    const entries = sortWith([
      ascend(data => -data.years[0].yyyy),
      ascend(data => data.song.position(data.years[0]))
    ])(data.filter(item => item.years.length === numberOfYears));

    return {numberOfYears, entries};
  });
})
</script>
