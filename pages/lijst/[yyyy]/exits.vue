<template lang="pug">
div(v-for='song in exits')
  song-with-position(:song="song")
    position-main(:song='song' :year='year.previous')
    position-annotation in {{year.previous.yyyy}}
</template>

<script setup>
const props = defineProps({
  exits: Array,
  year: Object
})
</script>