<template lang="pug">
span(v-if="countryName")
  img(
    :src='`https://flagcdn.com/20x15/${countryId}.png`'
    :srcset='`https://flagcdn.com/40x30/${countryId}.png 2x, https://flagcdn.com/60x45/${countryId}.png 3x`'
    :alt='countryName'
    width="20"
    height="15"
  )
  span.name(v-if='includeName') {{countryName}}
</template>

<script>
  import countries from '~/utils/country'

  export default {
    props: {
      countryId: String,
      includeName: Boolean
    },
    computed: {
      countryName() {
        return countries[this.countryId]
      }
    }
  }
</script>

<style scoped lang="scss">
img {
  vertical-align: middle;
}

span.name {
  margin-left: 5px;
  vertical-align: middle;
}
</style>
