<template lang="pug">
  select(:value='value' @input='update()' ref='input' :disabled="disabled")
    option(value='')
      | Alle landen
    option(v-for='countryId in usedCountryIds' :key='countryId' :value='countryId')
      | {{countries[countryId]}}
</template>

<script>
  import countries from '~/utils/country'
  import _ from 'lodash';

  export default {
    name: 'CountryInput',
    props: {
      value: {
        type: String,
        default: ''
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
