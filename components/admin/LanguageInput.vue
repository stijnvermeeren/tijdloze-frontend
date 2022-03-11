<template lang="pug">
  div
    div
      select(:value='value' @input='update()' ref='input')
        option(value='')
          | (Andere taal)
        option(v-for='[languageId, languageName] in Object.entries(languages)' :key='languageId' :value='languageId')
          | {{languageName}}
</template>

<script>
  import languages from '~/utils/language'

  export default {
    name: 'LanguageInput',
    props: ['value'],
    computed: {
      languages() {
        return languages;
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
