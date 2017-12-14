<template>
    <nuxt-link :to="'lijst/' + year.yyyy">{{year.yyyy}}</nuxt-link>
</template>

<script>
    export default {
      props: ["year"]
    }
</script>
