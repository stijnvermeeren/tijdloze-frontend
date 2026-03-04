<template lang="pug">
div
  d3-distribution-graph(:points='finalPoints' :secondary-points='nonFinalPoints')
  .legende
    ul
      li
        d3-color-label(:index='1')
        |  Definitieve eenjaarsvliegen (slechts één notering in alle lijsten)
      li
        d3-color-label(:index='2')
        |  Niet-definitieve eenjaarsvliegen
</template>

<script setup>
const props = defineProps({
  data: Array
})

const finalPoints = computed(() => {
  return props.data.filter(point => point.isFinal);
})
const nonFinalPoints = computed(() => {
  return props.data.filter(point => !point.isFinal);
})
</script>

<style scoped>
  @import "../../../assets/styleConfig.css";

  div.legende {
    ul {
      margin: 0;
      padding: 0;
      max-width: 40em;
      margin: 0 auto;
      li {
        list-style-type: none;
        list-style-position: outside;
        text-align: left;
      }
      img {
        margin-right: 2em;
        vertical-align: bottom;
        border: var(--black-line);
        border-radius: var(--border-radius);
      }
    }
  }
</style>
