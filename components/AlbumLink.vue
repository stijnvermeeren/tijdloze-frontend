<template lang="pug">
  nuxt-link(:to='`/album/${album.id}`') {{album.title}}
</template>

<script>
  export default {
    props: ["album"]
  }
</script>

<style lang="less" scoped>
  a {
    font-style: italic;
  }
</style>
