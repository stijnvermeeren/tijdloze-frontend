<template lang="pug">
song-with-position(v-for='song in sortedSongs' :key='song.id' :song="song" :year="currentYear")
</template>

<script setup>
import _ from 'lodash'

const props = defineProps({
  songs: Array
})

const {currentYear, previousYear} = storeToRefs(useYearStore())

const sortedSongs = computed(() => {
  return _.sortBy(
    props.songs,
    [
      song => song.position(currentYear.value, true),
      song => song.position(previousYear.value, true)
    ]
  )
})
</script>

<style lang="scss" scoped>
</style>