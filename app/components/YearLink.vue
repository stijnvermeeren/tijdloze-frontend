<template lang="pug">
nuxt-link(v-if="year" :to='`/lijst/${year.yyyy}`') {{text}}
</template>

<script setup lang="ts">
import type Year from "~/orm/Year";

const props = withDefaults(defineProps<{
  year: Year
  short?: boolean
}>(), {
  short: false
})

const text = computed(() => {
  return props.short ? props.year._yy : props.year.yyyy
})
</script>
