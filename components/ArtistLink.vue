<template lang="pug">
    nuxt-link(:to='`/artiest/${artist.id}-${artist.slug}`') {{content}}
</template>

<script>
  import Artist from "../orm/Artist";

  export default {
    props: {
      artist: Artist,
      text: String
    },
    computed: {
      content() {
        return this.text ? this.text : this.artist.fullName;
      }
    }
  }
</script>
