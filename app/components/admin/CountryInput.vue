<template lang="pug">
div.d-flex
  v-autocomplete(
    v-model="countryId"
    clearable
    label="Land"
    placeholder="Geen land geselecteerd"
    :items="countryOptions"
    hide-details
  )
  v-btn-toggle.ml-4(
    v-model="countryId"
    color="blue"
  )
    v-btn(value="us")
      country-icon(country-id="us")
    v-btn(value="gb")
      country-icon(country-id="gb")
    v-btn(value="be")
      country-icon(country-id="be")
</template>

<script setup>
import countries from '~/utils/country'
import sortBy from 'ramda/src/sortBy';

const countryId = defineModel()

const countryOptions = sortBy(countryId => countries[countryId])(Object.keys(countries)).map(countryId => {
  return {
    value: countryId,
    title: countries[countryId]
  }
})
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>

