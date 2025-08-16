<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.l Nummer
      th(colspan='2') Gedaald
    tr(v-for='{entry, position} in rankingList')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.l
        song-with-cover(:song='entry.song')
      td {{entry.newPosition - entry.oldPosition}} posities
      td.i {{entry.oldPosition}} &rarr; {{entry.newPosition}}
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
    ({oldPosition, newPosition}) => oldPosition - newPosition,
    [({newPosition}) => newPosition, ({year}) => year.yyyy],
    50
  );
})
</script>
