<template lang="pug">
nuxt-link(:to='`/album/${album.id}-${album.slug}`') {{album.title}}
</template>

<script>
  import Album from "../orm/Album";

  export default {
    props: {
      album: Album
    }
  }
</script>

<style lang="scss" scoped>
  a {
    font-style: italic;
  }
</style>
