<template lang="pug">
div
  span.position(v-if='song.position(year, true)') {{song.position(year, true)}}
  span(v-else-if="song.probablyInList(year, true)") ?
  span(v-else) -
</template>

<script setup>
import Year from "../orm/Year";

defineProps({
  song: Object,
  year: Year
})
</script>

<style lang="scss" scoped>
span.position {
  font-size: 110%;
  font-weight: bold;
}
</style>
