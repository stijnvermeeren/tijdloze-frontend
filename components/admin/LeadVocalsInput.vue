<template lang="pug">
  div
    div
      select(:value='value' ref='input' @input='update()')
        option(value='')
          | (Niet gedefinieerd)
        option(v-for='gender in vocalsGenders' :key='gender.id' :value='gender.id')
          | {{gender.name}}
</template>

<script>
  export default {
    name: 'LeadVocalsInput',
    props: ['value'],
    computed: {
      vocalsGenders() {
        return this.$store.state.vocalsGenders;
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
