<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup lang="ts">
import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

type NewcomerEntry = { song: Song; year: Year }

defineProps<{ data: NewcomerEntry[] }>()
</script>
