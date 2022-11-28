<template lang="pug">
  nuxt-link(:to='`/nummer/${song.id}-${song.slug}`') {{song.title}}
</template>

<script>
  export default {
    props: ["song"]
  }
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
