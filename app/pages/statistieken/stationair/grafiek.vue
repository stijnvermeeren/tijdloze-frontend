<template lang="pug">
d3-stationary-graph(:songs='songs')
</template>

<script setup>
const songs = computed(() => {
  return useRootStore().songs;
})
</script>
