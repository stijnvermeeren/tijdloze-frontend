<template lang="pug">
  div
    div
      select(:value='value' @input='update()' ref='input' :disabled="disabled")
        option(value='')
          | (Ander land)
        option(disabled=true)
          | -- Reeds gebruikte landen --
        option(v-for='countryId in usedCountryIds' :key='`used_${countryId}`' :value='countryId')
          | {{countries[countryId]}}
        option(disabled=true)
         | -- Alle landen --
        option(v-for='countryId in sortedCountryIds' :key='`all_${countryId}`' :value='countryId')
          | {{countries[countryId]}}
</template>

<script>
  import countries from '~/utils/country'
  import _ from 'lodash';

  export default {
    name: 'CountryInput',
    props: {
      value: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    computed: {
      countries() {
        return countries;
      },
      sortedCountryIds() {
        return _.sortBy(Object.keys(this.countries), countryId => countries[countryId])
      },
      usedCountryIds() {
        return this.sortedCountryIds.filter(countryId => this.$store.getters.usedCountryIds.has(countryId));
      }
    },
    methods: {
      update() {
        const newValue = this.$refs['input'].value;
        this.$emit('input', newValue);
      }
    }
  }
</script>

<style scoped>
  select {
    box-sizing: border-box;
    width: 100%;
  }
</style>
