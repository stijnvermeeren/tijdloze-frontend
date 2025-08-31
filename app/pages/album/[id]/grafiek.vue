<template lang="pug">
d3-graph(:entries="entries")
</template>

<script setup>
const props = defineProps({
  songs: {
    type: Array,
    required: true
  }
})

const entries = useGraphEntries(props.songs)
</script>

<style lang="scss" scoped>
</style>
