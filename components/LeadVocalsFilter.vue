<template lang="pug">
el-select(:value='modelValue' @input='input' placeholder="Lead vocals" clearable size="small")
  el-option(
    v-for='[genderId, genderName] in Object.entries(vocalsGenders)'
    :key='genderId'
    :value='genderId'
    :label="genderName")
</template>

<script>
  import vocalsGenders from '~/utils/leadVocals'

  export default {
    name: 'LeadVocalsInput',
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    computed: {
      vocalsGenders() {
        return vocalsGenders;
      }
    },
    methods: {
      input(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    }
  }
</script>
