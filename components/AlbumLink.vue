<template lang="pug">
nuxt-link(:to='`/album/${album.id}-${album.slug}`') {{album.title}}
</template>

<script setup>
defineProps({
  album: Object
})
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
