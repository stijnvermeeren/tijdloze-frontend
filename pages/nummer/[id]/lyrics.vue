<template lang="pug">
  .lyrics {{ lyrics }}
</template>

<script setup>
const props = defineProps({
  lyrics: String
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
