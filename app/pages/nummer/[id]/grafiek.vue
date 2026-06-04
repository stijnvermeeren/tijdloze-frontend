<template lang="pug">
d3-graph(:entries='entries' no-label)
</template>

<script setup lang="ts">
import type Song from '~/orm/Song'

const props = defineProps<{ song: Song }>()
const entries = useGraphEntries([props.song])
</script>

<style scoped>
</style>
