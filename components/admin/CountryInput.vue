<template lang="pug">
div.d-flex
  v-autocomplete(
    :model-value='modelValue'
    @update:model-value='update'
    clearable
    label="Land"
    placeholder="Geen land geselecteerd"
    :items="countryOptions"
    hide-details
  )
  v-btn-toggle.ml-4(
    :model-value='modelValue'
    @update:model-value='update'
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

defineProps({
  modelValue: {
    type: String
  }
})

const emit = defineEmits(['update:modelValue'])

const countryOptions = _.sortBy(
  Object.keys(countries),
  countryId => countries[countryId]
).map(countryId => {
  return {
    value: countryId,
    title: countries[countryId]
  }
})

function update(newValue) {
  emit('update:modelValue', newValue)
}
</script>

<style lang="scss" scoped>
div.d-flex {
  align-items: center;
}
</style>

