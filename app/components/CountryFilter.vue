<template lang="pug">
v-select(
  v-model="model"
  :items="items"
  :disabled="disabled"
  label="Nationaliteit van artiest"
  clearable
  density="compact"
  hide-details
)
</template>

<script setup>
import countries from '~/utils/country'
import {useRootStore} from "~/stores/root";
import { sortBy } from 'ramda';

const props = defineProps({
  disabled: {
    type: Boolean,
    default: false
  }
})

const model = defineModel()

const sortedCountryIds = sortBy(countryId => countries[countryId])(Object.keys(countries))

const usedCountryIds = computed(() => {
  return sortedCountryIds.filter(countryId => useRootStore().usedCountryIds.has(countryId))
})

const items = computed(() => {
  return usedCountryIds.value.map(countryId => {
    return {
      title: countries[countryId],
      value: countryId,
    }
  })
})
</script>
