<template>
    <nuxt-link :to="`/lijst/${year.yyyy}`">{{year._yy}}</nuxt-link>
</template>

<script>
    export default {
      props: ["year"]
    }
</script>
