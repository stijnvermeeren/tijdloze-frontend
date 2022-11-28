<template lang="pug">
  nuxt-link(v-if="countryName" :to='`/database?type=artiesten&land=${countryId}`')
    img(
      :src='`https://flagcdn.com/20x15/${countryId}.png`'
      :srcset='`https://flagcdn.com/40x30/${countryId}.png 2x, https://flagcdn.com/60x45/${countryId}.png 3x`'
      :alt='countryName'
      width="20"
      height="15"
    )
    span(v-if='includeName')  {{countryName}}
</template>

<script>
  import countries from '~/utils/country'

  export default {
    props: ["countryId", "includeName"],
    computed: {
      countryName() {
        return countries[this.countryId]
      }
    }
  }
</script>
