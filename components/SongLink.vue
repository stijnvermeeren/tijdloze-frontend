<template>
    <nuxt-link :to="'nummer/' + coreSong.id" class="list">{{coreSong.title}}</nuxt-link>
</template>

<script>
  export default {
    props: ["coreSong"]
  }
</script>
