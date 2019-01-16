<template lang="pug">
  nuxt-link(:to='`/lijst/${year.yyyy}`') {{year._yy}}
</template>

<script>
  export default {
    props: ["year"]
  }
</script>
