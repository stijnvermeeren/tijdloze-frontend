<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type { ReentryEntry } from '~/types/statistieken/reentryEntry'

defineProps<{ data: ReentryEntry[] }>()
</script>
