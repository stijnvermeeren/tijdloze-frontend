<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Aantal jaren
      th
        table.valueValueSong
          tbody
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
                | {{firstYear(entry.years).yyyy}}-{{lastYear(entry.years).yyyy}}
              td.i
                | {{entry.position}}
              td.l
                song-with-cover(:song='entry.song')
</template>

<script setup lang="ts">
import { sortWith, ascend, range } from 'ramda'
import Song from '~/orm/Song'
import type Year from '~/orm/Year'

const props = defineProps<{ years: Year[] }>()

type StationaryEntry = {
  song: Song
  years: Year[]
  position: number
}

function firstYear(years: Year[]): Year {
  return years[0] as Year
}

function lastYear(years: Year[]): Year {
  return years[years.length - 1] as Year
}

const songs = computed(() => {
  return useRootStore().songs;
})
const byNumberOfYears = computed(() => {
  const allYears = useYearStore().years
  let data: StationaryEntry[] = [];
  let maxYears = 0;
  songs.value.forEach(song => {
    song.stationaryIntervals(allYears)
      .filter((interval: Year[]) => interval.length > 2)
      .map((interval: Year[]) => {
        maxYears = Math.max(maxYears, interval.length);
        data.push({
          song,
          years: interval,
          position: song.position(firstYear(interval))!
        });
      })
  });

  return range(3, maxYears + 1).reverse().map(numberOfYears => {
    const entries = sortWith<StationaryEntry>([
      ascend((entry: StationaryEntry) => -firstYear(entry.years).yyyy),
      ascend((entry: StationaryEntry) => entry.position)
    ])(data.filter((item: StationaryEntry) => item.years.length === numberOfYears));

    return {numberOfYears, entries};
  });
})
</script>
