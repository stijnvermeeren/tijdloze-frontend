<template lang="pug">
div.container
  div.previous(v-if="previousPosition && !hidePreviousNext" :title="`Positie in ${previousYear.yyyy}`")
    nuxt-link(:to="`/lijst/${previousYear.yyyy}`") ←
    |
    | {{previousPosition}}
  div.main
    position-main.position-main(:position="position" :probably-in-list="song.probablyInList(year, true)")
    position-annotation(v-if='position && previousYear')
      position-change(:position="position" :previous-position="previousPosition")
  div.next(v-if="nextPosition && !hidePreviousNext" :title="`Positie in ${nextYear.yyyy}`")
    | {{nextPosition}}
    |
    nuxt-link(:to="`/lijst/${nextYear.yyyy}`") →
</template>

<script setup>
import Year from "../orm/Year";

const props = defineProps({
  song: Object,
  year: Year,
  hidePreviousNext: {
    type: Boolean,
    default: false
  },
  overridePosition: {
    type: Number,
    default: 0
  }
})

const position = computed(() => {
  if (props.overridePosition) {
    return props.overridePosition
  } else {
    return props.song.position(props.year, true);
  }
})

const yearContext = computed(() => useYearStore().context.forYear(props.year))
const previousYear = computed(() => yearContext.value.previous?.year)
const nextYear = computed(() => yearContext.value.next?.year)

const previousPosition = computed(() => {
  if (previousYear.value) {
    return props.song.position(previousYear.value, true);
  }
})
const nextPosition = computed(() => {
  if (nextYear.value) {
    return props.song.position(nextYear.value, true);
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
