<template lang="pug">
div(v-for='song in newSongs')
  song-with-position(:song="song")
    position-main(:song='song' :year='year')
    position-annotation(v-if='song.isReEntry(year)') re-entry
</template>

<script setup>
const props = defineProps({
  newSongs: Array,
  year: Object
})
</script>