<template lang="pug">
  div
    div
      select(:value='value' @input='update()' ref='input')
        option(value='')
          | (Ander land)
        option(v-for='country in countries' :key='country.id' :value='country.id')
          | {{country.name}}
</template>

<script>
  export default {
    name: 'CountryInput',
    props: ['value'],
    computed: {
      countries() {
        return this.$store.state.countries;
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
