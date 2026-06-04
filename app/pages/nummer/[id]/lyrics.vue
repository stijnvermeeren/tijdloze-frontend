<template lang="pug">
  .lyrics {{ fullSongData?.lyrics }}
</template>

<script setup lang="ts">
const props = defineProps({
  fullSongData: {
    type: Object,
    required: true
  }
})
</script>

<style scoped>
div.lyrics {
  padding: 0 20px 10px 20px;
  white-space: pre-line;
  font-style: italic;
  font-size: 14px;
}
</style>
