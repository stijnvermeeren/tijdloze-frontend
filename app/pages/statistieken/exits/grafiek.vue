<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type { ExitEntry } from './exitEntry'

defineProps<{ data: ExitEntry[] }>()
</script>
