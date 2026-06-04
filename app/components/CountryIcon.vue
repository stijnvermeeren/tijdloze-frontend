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

<script setup lang="ts">
import countries from '~/utils/country'

const props = withDefaults(defineProps<{
  countryId: string
  includeName?: boolean
}>(), {
  includeName: false
})

const countryMap = countries

const countryName = computed(() => {
  return countryMap[props.countryId]
})
</script>

<style scoped>
img {
  vertical-align: middle;
}

span.name {
  margin-left: 5px;
  vertical-align: middle;
}
</style>
