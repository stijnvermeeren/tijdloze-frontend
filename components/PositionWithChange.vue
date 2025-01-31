<template lang="pug">
  div
    position-main(:position="position" :probably-in-list="song.probablyInList(year, true)")
    position-annotation(v-if='position && previousYear')
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

const yearContext = computed(() => useYearStore().context.forYear(props.year))
const previousYear = computed(() => yearContext.value.previous?.year)
const previousPosition = computed(() => {
  if (previousYear.value) {
    return props.song.position(previousYear.value, true);
  }
})
</script>

<style lang="scss" scoped>
</style>
