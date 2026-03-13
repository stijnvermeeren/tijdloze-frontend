<template lang="pug">
d3-graph(:entries="entries")
</template>

<script setup lang="ts">
import type Song from '~/orm/Song'

const props = defineProps<{ songs: Song[] }>()

const entries = useGraphEntries(props.songs)
</script>

<style scoped>
</style>
