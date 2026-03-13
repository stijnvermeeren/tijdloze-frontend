<template lang="pug">
table.lijst.perVijf
  tbody
    tr
      th
      th Jaar
      th.l Nummer
      th(colspan='2') Gestegen
    tr(v-for='{entry, position} in rankingList')
      td.r {{position}}
      td
        year-link(:year='entry.year')
      td.l
        song-with-cover(:song='entry.song')
      td {{entry.oldPosition - entry.newPosition}} posities
      td.i {{entry.oldPosition}} &rarr; {{entry.newPosition}}
</template>

<script setup lang="ts">
import ranking from '~/utils/ranking';
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type RiseEntry = { song: Song; year: Year; oldPosition: number; newPosition: number }

const props = defineProps<{ data: RiseEntry[]; years: Year[] }>()

const rankingList = computed(() => {
  return ranking(
    props.data,
    ({oldPosition, newPosition}) => newPosition - oldPosition,
    [({newPosition}) => newPosition, ({year}) => year.yyyy],
    50
  );
})
</script>
