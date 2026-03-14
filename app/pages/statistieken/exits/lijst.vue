<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.l Nummer
      th Plaats
    tr(v-for='{entry, position} in rankingList')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.l
        song-with-cover(:song='entry.song')
      td {{entry.song.position(entry.year)}}
</template>

<script setup lang="ts">
import ranking from '~/utils/ranking';
import type Year from '~/orm/Year'
import type { SongYearEntry } from '~/pages/statistieken/songYearEntry'

const props = defineProps<{ data: SongYearEntry[]; years: Year[] }>()

const rankingList = computed(() => {
  return ranking(
    props.data,
    ({song, year}) => song.position(year)!,
    ({year}) => year.yyyy,
    50
  );
})
</script>
