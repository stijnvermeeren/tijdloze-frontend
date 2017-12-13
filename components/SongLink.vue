<template>
    <nuxt-link :to="'nummer/' + song.id">{{song.title}}</nuxt-link>
</template>

<script>
  export default {
    props: ["song"]
  }
</script>

<style lang="less" scoped>
    a {
        font-style: italic;
    }
</style>
