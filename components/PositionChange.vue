<template lang="pug">
div(:class="{singleLine: singleLine}")
  position-main(:song="song" :year="year")
  position-annotation(v-if='position && equal' type="equal") =
  position-annotation(v-if='position && down' type="down") -{{diff}}
  position-annotation(v-if='position && up' type="up") +{{diff}}
  position-annotation(v-if='position && isNew' type="up") nieuw
</template>

<script setup>
import Year from "../orm/Year";

const props = defineProps({
  song: Object,
  year: Year,
  singleLine: {
    type: Boolean,
    default: false
  }
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
const diff = computed(() => {
  return Math.abs(position.value - previousPosition.value)
})
const equal = computed(() => {
  return props.year.previous && position.value && position.value === previousPosition.value
})
const up = computed(() => {
  return props.year.previous && position.value && previousPosition.value && position.value < previousPosition.value
})
const isNew = computed(() => {
  return props.year.previous && position.value && !previousPosition.value
})
const down = computed(() => {
  return props.year.previous && previousPosition.value && (!position.value || position.value > previousPosition.value)
})
</script>

<style lang="scss" scoped>
div.singleLine {
  display: flex;
  justify-content: space-evenly;

  > * {
    width: 40%;
  }
}
</style>
