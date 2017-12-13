<template>
    <div>
        <nuxt-link :to="'artiest/' + artist.id">{{artist | fullname}}</nuxt-link>
    </div>
</template>

<script>
  export default {
    props: ["artist"]
  }
</script>
