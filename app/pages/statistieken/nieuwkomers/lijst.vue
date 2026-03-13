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
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type NewcomerEntry = { song: Song; year: Year }

const props = defineProps<{ data: NewcomerEntry[]; years: Year[] }>()

const rankingList = computed(() => {
  return ranking(
    props.data,
    ({song, year}) => song.position(year) ?? Number.MAX_SAFE_INTEGER,
    ({year}) => year.yyyy,
    50
  );
})
</script>
