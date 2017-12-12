<template>
    <nuxt-link :to="'artiest/' + coreArtist.id" class="list">{{coreArtist | fullname}}</nuxt-link>
</template>

<script>
  export default {
    props: ["coreArtist"]
  }
</script>
