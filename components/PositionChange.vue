<template lang="pug">
div(v-if='position' :class="{singleLine: singleLine}")
  div.position {{position}}
  div.change
    span.equal(v-if='equal') =
    span.down(v-if='down') -{{diff}}
    span.up(v-if='up') +{{diff}}
    span.up(v-if='isNew') nieuw
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
  div.position {
    width: 40%;
  }
  div.change {
    width: 40%;
  }
}

div.position {
  font-size: 110%;
  font-weight: bold;
}

div.change {
  font-size: 80%;

  span.up {
    color: #007700;
  }
  span.down {
    color: #aa0000;
  }
  span.equal {
    color: #777;
  }
}
</style>
