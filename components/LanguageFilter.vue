<template lang="pug">
el-select(:value='value' @input='input' placeholder="Taal" clearable size="small")
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
      value: String
    },
    computed: {
      languages() {
        return languages;
      }
    },
    methods: {
      input(newValue) {
        this.$emit('input', newValue);
      }
    }
  }
</script>
