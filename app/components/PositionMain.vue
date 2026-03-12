<template lang="pug">
div
  span.position(v-if='position') {{position}}
  span(v-else-if="probablyInList") ?
  span(v-else) -
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  position?: number
  probablyInList?: boolean
}>(), {
  probablyInList: false
})
</script>

<style scoped>
span.position {
  font-weight: bold;
}
</style>
