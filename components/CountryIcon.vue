<template lang="pug">
  nuxt-link(:to='`/artiesten/perland/${country.id}`')
    img(:src='`/images/nat/${country.id}.png`' :alt='country.name')
    span(v-if='includeName')  {{country.name}}
</template>

<script>
  export default {
    props: ["country", "includeName"]
  }
</script>
