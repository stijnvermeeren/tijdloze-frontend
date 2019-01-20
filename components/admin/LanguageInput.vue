<template lang="pug">
  div
    div
      select(:value='value' @input='update()' ref='input')
        option(v-for='language in languages' :key='language.id' :value='language.id')
          | {{language.name}}
</template>

<script>
  export default {
    name: 'LanguageInput',
    props: ['value'],
    computed: {
      languages() {
        return this.$store.state.languages;
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
