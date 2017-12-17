<template>
    <nuxt-link :to="`/album/${album.id}`">{{album.title}}</nuxt-link>
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
