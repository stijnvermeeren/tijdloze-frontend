<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type { NewcomerEntry } from './newcomerEntry'

defineProps<{ data: NewcomerEntry[] }>()
</script>
