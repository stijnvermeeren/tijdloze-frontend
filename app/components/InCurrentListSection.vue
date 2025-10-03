<template lang="pug">
song-with-position(v-for='song in sortedSongs' :key='song.id' :song="song" :year="currentYear")
</template>

<script setup>
import sortWith from 'ramda/src/sortWith';
import ascend from 'ramda/src/ascend';

const props = defineProps({
  songs: Array
})

const {currentYear, previousYear} = storeToRefs(useYearStore())

const sortedSongs = computed(() => {
  return sortWith(
    [
      ascend(song => song.position(currentYear.value, true) || Infinity),
      ascend(song => song.position(previousYear.value, true) || Infinity)
    ]
  )(props.songs)
})
</script>

<style lang="scss" scoped>
</style>