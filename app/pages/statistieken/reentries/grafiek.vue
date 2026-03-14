<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type { ReentryEntry } from './reentryEntry'

defineProps<{ data: ReentryEntry[] }>()
</script>
