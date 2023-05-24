<template lang="pug">
nuxt-link(:to='`/nummer/${song.id}-${song.slug}`') {{song.title}}
</template>

<script>
  import Song from "../orm/Song";

  export default {
    props: {
      song: Song
    }
  }
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
