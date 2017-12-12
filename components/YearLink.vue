<template>
    <nuxt-link :to="'lijst/' + year" class="list">{{year}}</nuxt-link>
</template>

<script>
    export default {
      props: ["year"]
    }
</script>
