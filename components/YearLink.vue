<template lang="pug">
  nuxt-link(:to='`/lijst/${year.yyyy}`') {{year.yyyy}}
</template>

<script>
  export default {
    props: ["year"]
  }
</script>
