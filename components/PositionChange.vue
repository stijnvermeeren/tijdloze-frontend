<template lang="pug">
div
  .equal(v-if='equal') =
  .down(v-if='down') -{{diff}}
  .up(v-if='up') +{{diff}}
  .up(v-if='isNew') nieuw
</template>

<script setup>
const props = defineProps({
  position: Number,
  previousPosition: Number
})

const diff = computed(() => {
  return Math.abs(props.position - props.previousPosition)
})
const equal = computed(() => {
  return props.position && props.position === props.previousPosition
})
const up = computed(() => {
  return props.position && props.previousPosition && props.position < props.previousPosition
})
const isNew = computed(() => {
  return props.position && !props.previousPosition
})
const down = computed(() => {
  return props.previousPosition && (!props.position || props.position > props.previousPosition)
})
</script>

<style lang="scss" scoped>
div {
  font-size: 90%;
  font-style: italic;

  div.up {
    color: #227722;
  }
  div.down {
    color: #aa2222;
  }
  div.equal {
    color: #777;
  }
}
</style>
