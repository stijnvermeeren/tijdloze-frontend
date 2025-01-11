<template lang="pug">
nuxt-link(:to='`/lijst/${year.yyyy}`') {{year._yy}}
</template>

<script setup>
const props = defineProps({
  year: Object
})
</script>
