<template lang="pug">
div(v-for='entry in newSongs' :key="entry.position")
  song-with-position(:song="entry.song")
    position-main(:position='entry.position')
    position-annotation(v-if='entry.song.isReEntry(year)') re-entry
</template>

<script setup>
const props = defineProps({
  newSongs: Array,
  year: Object
})
</script>