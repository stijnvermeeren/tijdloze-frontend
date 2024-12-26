<template lang="pug">
  div
    position-main(:position="position" :probably-in-list="song.probablyInList(year, true)")
    position-annotation(v-if='position && year.previous')
      position-change(:position="position" :previous-position="previousPosition")
</template>

<script setup>
import Year from "~/orm/Year";

const props = defineProps({
  song: Object,
  year: Year
})

const position = computed(() => {
  return props.song.position(props.year, true);
})

const previousPosition = computed(() => {
  if (props.year.previous) {
    return props.song.position(props.year.previous, true);
  } else {
    return null;
  }
})
</script>

<style lang="scss" scoped>
</style>
