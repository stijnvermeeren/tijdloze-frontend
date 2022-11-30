<template lang="pug">
  el-select(:value='value' @input='input' placeholder="Lead vocals" clearable size="small")
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
      value: String
    },
    computed: {
      vocalsGenders() {
        return vocalsGenders;
      }
    },
    methods: {
      input(newValue) {
        this.$emit('input', newValue);
      }
    }
  }
</script>
