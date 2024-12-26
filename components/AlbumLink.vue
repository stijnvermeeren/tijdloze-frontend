<template lang="pug">
nuxt-link(:to='`/album/${album.id}-${album.slug}`')
  album-title(:album="album")
</template>

<script setup>
const props = defineProps({
  album: Object
})
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
