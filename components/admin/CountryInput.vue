<template lang="pug">
div.container
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(label="us")
      country-icon(country-id="us")
    el-radio-button(label="gb")
      country-icon(country-id="gb")
    el-radio-button(label="be")
      country-icon(country-id="be")
  el-select(v-model='liveValue' clearable filterable placeholder="Geen land geselecteerd" size="small")
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
    props: {
      modelValue: {
        type: String
      },
      disabled: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        liveValue: this.modelValue
      }
    },
    emits: ['update:modelValue'],
    computed: {
      countries() {
        return countries;
      },
      sortedCountryIds() {
        return _.sortBy(Object.keys(this.countries), countryId => countries[countryId])
      }
    },
    watch: {
      modelValue(newValue) {
        this.liveValue = newValue;
      },
      liveValue(newValue, oldValue) {
        if (newValue !== oldValue) {
          this.$emit('update:modelValue', newValue);
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
div.container > div {
  vertical-align: middle;
}

.el-radio-group {
  margin-right: 10px;
}
</style>

