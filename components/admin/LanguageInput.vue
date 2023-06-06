<template lang="pug">
div.container
  el-radio-group(v-model='liveValue' size="small")
    el-radio-button(label="en") Engels
    el-radio-button(label="nl") Nederlands
    el-radio-button(label="i") Instrumentaal
  el-select(v-model='liveValue' clearable filterable placeholder="Geen taal geselecteerd" size="small")
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
    props: {
      modelValue: String
    },
    emits: ['update:modelValue'],
    data() {
      return {
        liveValue: this.modelValue
      }
    },
    computed: {
      languages() {
        return languages;
      }
    },
    watch: {
      modelValue(newValue) {
        this.liveValue = newValue
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
