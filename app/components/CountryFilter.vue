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

<script setup lang="ts">
import countries from '~/utils/country'
import {useRootStore} from "~/stores/root";
import { sortBy } from 'ramda'

withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false
})

const model = defineModel()

const countryMap = countries

const sortedCountryIds = sortBy((countryId: string) => countryMap[countryId]!, Object.keys(countryMap))

const usedCountryIds = computed(() => {
  return sortedCountryIds.filter(countryId => useRootStore().usedCountryIds.has(countryId))
})

const items = computed(() => {
  return usedCountryIds.value.map(countryId => {
    return {
      title: countryMap[countryId],
      value: countryId,
    }
  })
})
</script>
