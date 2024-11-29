$<template lang="pug">
div.container
  div.previous(v-if="previousPosition" :title="`Positie in ${year.previous.yyyy}`")
    nuxt-link(:to="`/lijst/${year.previous.yyyy}`") ←
    |
    | {{previousPosition}}
  div.main
    position-main.position-main(:song="song" :year="year")
    position-annotation(v-if='position && year.previous')
      position-change(:position="position" :previous-position="previousPosition")
  div.next(v-if="nextPosition" :title="`Positie in ${year.next.yyyy}`")
    | {{nextPosition}}
    |
    nuxt-link(:to="`/lijst/${year.next.yyyy}`") →
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
const nextPosition = computed(() => {
  if (props.year.next) {
    return props.song.position(props.year.next, true);
  } else {
    return null;
  }
})
</script>

<style lang="scss" scoped>
div.container {
  display: flex;
  flex-direction: column;
  padding: 0 10px;

  .position-main {
    margin-bottom: -3px;
  }
  div.previous, div.next {
    font-size: 60%;
    color: #777;
  }
  div.previous {
    margin-bottom: -1px;
    align-self: flex-start;
  }
  div.next {
    margin-top: -1px;
    align-self: flex-end;
  }
}
</style>
