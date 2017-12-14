<template>
    <div>
        <nuxt-link :to="'artiest/' + artist.id">{{artist.fullName}}</nuxt-link>
    </div>
</template>

<script>
  export default {
    props: ["artist"]
  }
</script>
