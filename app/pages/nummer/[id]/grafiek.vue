<template lang="pug">
d3-graph(:entries='entries' no-label)
</template>

<script setup>
const props = defineProps({
  song: {
    type: Object,
    required: true
  }
})
const entries = useGraphEntries([props.song])
</script>

<style lang="scss" scoped>
</style>
