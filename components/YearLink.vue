<template lang="pug">
  nuxt-link(:to='`/lijst/${year.yyyy}`') {{text}}
</template>

<script>
  import Year from "../orm/Year";

  export default {
    props: {
      year: Year,
      short: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      text() {
        return this.short ? this.year._yy : this.year.yyyy
      }
    }
  }
</script>
