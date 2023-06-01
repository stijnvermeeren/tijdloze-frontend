<template lang="pug">
div
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(label="us")
      country-icon(country-id="us")
    el-radio-button(label="gb")
      country-icon(country-id="gb")
    el-radio-button(label="be")
      country-icon(country-id="be")
  el-select(v-model='liveValue' clearable filterable placeholder="Geen land geselecteerd")
    el-option(
      v-for='countryId in sortedCountryIds'
      :key='countryId'
      :value='countryId'
      :label="countries[countryId]"
    )
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
    data() {
      return {
        liveValue: this.value
      }
    },
    computed: {
      countries() {
        return countries;
      },
      sortedCountryIds() {
        return _.sortBy(Object.keys(this.countries), countryId => countries[countryId])
      }
    },
    watch: {
      value(newValue) {
        this.liveValue = newValue;
      },
      liveValue(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('input', newValue);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .el-radio-group {
    margin-right: 10px;
  }
</style>

