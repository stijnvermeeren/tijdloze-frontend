<template lang="pug">
d3-graph(:songs='top100Songs')
</template>

<script setup>
const props = defineProps({
  top100Songs: Object
})
</script>

<style lang="scss" scoped>
</style>
