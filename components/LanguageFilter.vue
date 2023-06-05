<template lang="pug">
el-select(:value='modelValue' @input='input' placeholder="Taal" clearable size="small")
  el-option(
    v-for='[languageId, languageName] in Object.entries(languages)'
    :key='languageId'
    :value='languageId'
    :label="languageName")
</template>

<script>
  import languages from '~/utils/language'

  export default {
    name: 'LanguageInput',
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    computed: {
      languages() {
        return languages;
      }
    },
    methods: {
      input(newValue) {
        this.$emit('update:modelValue', newValue);
      }
    }
  }
</script>
