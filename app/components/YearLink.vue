<template lang="pug">
nuxt-link(:to='`/lijst/${year.yyyy}`') {{text}}
</template>

<script setup>
import Year from "../orm/Year";

const props = defineProps({
  year: Year,
  short: {
    type: Boolean,
    default: false
  }
})

const text = computed(() => {
  return props.short ? props.year._yy : props.year.yyyy
})
</script>
