<template>
    <nuxt-link :to="'artiesten/perland/' + country.id"><img :src="'/images/nat/' + country.id + '.png'" :alt="country.name" /></nuxt-link>
</template>

<script>
    export default {
      props: ["country"]
    }
</script>
