<template>
    <nuxt-link :to="'lijst/' + year">{{year}}</nuxt-link>
</template>

<script>
    export default {
      props: ["year"]
    }
</script>
