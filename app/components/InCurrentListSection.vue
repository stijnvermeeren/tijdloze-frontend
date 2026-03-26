<template lang="pug">
song-with-position(v-if='currentYear' v-for='song in sortedSongs' :key='song.id' :song="song" :year="currentYear" show-entry-stats)
</template>

<script setup lang="ts">
import type Song from '~/orm/Song';
import { sortWith, ascend } from 'ramda';

const props = defineProps<{
  songs: Song[]
}>()

const {currentYear, previousYear} = storeToRefs(useYearStore())

const sortedSongs = computed(() => {
  return sortWith(
    [
      ascend((song: Song) => currentYear.value ? (song.position(currentYear.value, true) ?? Infinity) : Infinity),
      ascend((song: Song) => previousYear.value ? (song.position(previousYear.value, true) ?? Infinity) : Infinity)
    ],
    props.songs
  )
})
</script>

<style scoped>
</style>