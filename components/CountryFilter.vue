<template lang="pug">
el-select(:value='value' @input='input' :disabled="disabled" placeholder="Nationaliteit van artiest" clearable size="small")
  el-option(v-for='countryId in usedCountryIds' :key='countryId' :value='countryId' :label="countries[countryId]")
</template>

<script>
  import countries from '~/utils/country'
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";

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
        return this.sortedCountryIds.filter(countryId => useRootStore().usedCountryIds.has(countryId));
      }
    },
    methods: {
      input(value) {
        this.$emit('input', value);
      }
    }
  }
</script>
