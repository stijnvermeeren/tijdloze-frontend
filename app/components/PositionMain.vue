<template lang="pug">
div
  span.position(v-if='position') {{position}}
  span(v-else-if="probablyInList") ?
  span(v-else) -
</template>

<script setup>
defineProps({
  position: Number,
  probablyInList: {
    type: Boolean,
    default: false
  }
})
</script>

<style scoped>
span.position {
  font-weight: bold;
}
</style>
