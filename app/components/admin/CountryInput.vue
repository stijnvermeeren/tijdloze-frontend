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

<script setup lang="ts">
import countries from '~/utils/country'
import { sortBy } from 'ramda';

const countryId = defineModel()

const countryOptions = sortBy((countryId: string) => countries[countryId]!, Object.keys(countries)).map((id: string) => {
  return {
    value: id,
    title: countries[id]
  }
})
</script>

<style scoped>
div.d-flex {
  align-items: center;
}
</style>

