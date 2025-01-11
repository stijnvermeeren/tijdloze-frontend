<template lang="pug">
d3-stationary-graph(:songs='songs')
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const songs = computed(() => {
  return useRootStore().songs;
})
</script>
