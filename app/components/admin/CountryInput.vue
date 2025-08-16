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
import _ from 'lodash';

const countryId = defineModel()

const countryOptions = _.sortBy(
  Object.keys(countries),
  countryId => countries[countryId]
).map(countryId => {
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

