<template lang="pug">
v-select(
  :model-value='modelValue'
  @update:model-value='input'
  :items="items"
  :disabled="disabled"
  label="Nationaliteit van artiest"
  clearable
  density="compact"
  hide-details
)
</template>

<script>
  import countries from '~/utils/country'
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";

  export default {
    props: {
      modelValue: String,
      disabled: {
        type: Boolean,
        default: false
      }
    },
    emits: ['update:modelValue'],
    computed: {
      sortedCountryIds() {
        return _.sortBy(Object.keys(countries), countryId => countries[countryId])
      },
      usedCountryIds() {
        return this.sortedCountryIds.filter(countryId => useRootStore().usedCountryIds.has(countryId));
      },
      items() {
        return this.usedCountryIds.map(countryId => {
          return {
            title: countries[countryId],
            value: countryId,
          }
        })
      }
    },
    methods: {
      input(value) {
        this.$emit('update:modelValue', value);
      }
    }
  }
</script>
