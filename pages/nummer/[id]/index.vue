<template lang="pug">
  in-current-list(:songs='[song]')
</template>

<script setup>
const props = defineProps({
  song: Object
})
</script>

<style lang="scss" scoped>
</style>
