<template lang="pug">
  div
    div
      select(:value='value' ref='input' @input='update()')
        option(value='')
          | (Lead vocals niet gedefinieerd)
        option(v-for='[genderId, genderName] in Object.entries(vocalsGenders)' :key='genderId' :value='genderId')
          | {{genderName}}
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'

  export default {
    name: 'LeadVocalsInput',
    props: {
      value: String
    },
    computed: {
      vocalsGenders() {
        return vocalsGenders;
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
