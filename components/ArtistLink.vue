<template lang="pug">
    nuxt-link(:to='`/artiest/${artist.id}`') {{content}}
</template>

<script>
  export default {
    props: ["artist", "text"],
    computed: {
      content() {
        return this.text ? this.text : this.artist.fullName;
      }
    }
  }
</script>
