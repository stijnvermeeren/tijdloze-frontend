<template lang="pug">
nuxt-link(:to='`/lijst/${year.yyyy}`') {{year._yy}}
</template>

<script setup lang="ts">
import type Year from "~/orm/Year";

defineProps<{
  year: Year
}>()
</script>
