<template lang="pug">
span
  span(v-if='song.position(year, true)') {{song.position(year, true)}}
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
