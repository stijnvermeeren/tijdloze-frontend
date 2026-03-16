<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

defineProps<{ data: SongYearEntry[] }>()
</script>
