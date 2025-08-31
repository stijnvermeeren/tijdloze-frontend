<template lang="pug">
  .lyrics {{ fullSongData?.lyrics }}
</template>

<script setup>
const props = defineProps({
  fullSongData: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss" scoped>
div.lyrics {
  padding: 0 20px 10px 20px;
  white-space: pre-line;
  font-style: italic;
  font-size: 14px;
}
</style>
