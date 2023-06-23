<template lang="pug">
d3-distribution-graph(:points='data')
</template>

<script setup>
defineProps({
  data: Array
})
</script>
