<template lang="pug">
nuxt-link(:to='`/artiest/${artist.id}-${artist.slug}`') {{content}}
</template>

<script>
  import Artist from "../orm/Artist";

  export default {
    name: 'ArtistLink',
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
