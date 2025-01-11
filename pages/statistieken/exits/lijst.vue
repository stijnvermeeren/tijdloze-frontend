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

<script setup>
import ranking from '~/utils/ranking';

const props = defineProps({
  data: Array,
  years: Array
})

const rankingList = computed(() => {
  return ranking(
    props.data,
    ({song, year}) => song.position(year),
    ({year}) => year.yyyy,
    50
  );
})
</script>
