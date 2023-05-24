<template lang="pug">
div
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(label="en") Engels
    el-radio-button(label="nl") Nederlands
    el-radio-button(label="i") Instrumentaal
  el-select(v-model='liveValue' clearable filterable placeholder="Geen taal geselecteerd")
    el-option(
      v-for='[languageId, languageName] in Object.entries(languages)'
      :key='languageId'
      :value='languageId'
      :label="languageName"
    )
</template>

<script>
  import languages from '~/utils/language'

  export default {
    name: 'LanguageInput',
    props: {
      value: String
    },
    data() {
      return {
        liveValue: this.value
      }
    },
    computed: {
      languages() {
        return languages;
      }
    },
    watch: {
      value(newValue) {
        this.liveValue = newValue
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
