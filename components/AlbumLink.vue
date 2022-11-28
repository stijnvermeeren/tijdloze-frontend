<template lang="pug">
  nuxt-link(:to='`/album/${album.id}-${album.slug}`') {{album.title}}
</template>

<script>
  export default {
    props: ["album"]
  }
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
