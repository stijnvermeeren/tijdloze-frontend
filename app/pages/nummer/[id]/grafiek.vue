<template lang="pug">
d3-graph(:songs='[song]' no-label)
</template>

<script setup>
const props = defineProps({
  song: Object
})
</script>

<style lang="scss" scoped>
</style>
