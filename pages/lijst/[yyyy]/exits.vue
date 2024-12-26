<template lang="pug">
div(v-for='entry in exits')
  song-with-position(:song="entry.song")
    position-main(:position="entry.position")
    position-annotation in {{year.previous.yyyy}}
</template>

<script setup>
const props = defineProps({
  exits: Array,
  year: Object
})
</script>