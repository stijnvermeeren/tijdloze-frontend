<template>
    <nuxt-link :to="`/artiest/${artist.id}`">{{artist.fullName}}</nuxt-link>
</template>

<script>
  export default {
    props: ["artist"]
  }
</script>
