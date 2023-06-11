<template lang="pug">
nuxt-link(:to='`/nummer/${song.id}-${song.slug}`') {{song.title}}
</template>

<script setup>
defineProps({
  song: Object
})
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
