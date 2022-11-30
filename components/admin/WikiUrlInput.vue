<template lang="pug">
  div
    div
      input(:value='value' ref='input' @input='update()')
    .visit(v-if='value')
      a(:href='value') Visit
    .search(v-if='query')
      a(:href='searchUrl') Search
</template>

<script>
  export default {
    name: 'WikiUrlInput',
    props: {
      value: String,
      lang: String,
      query: String
    },
    computed: {
      searchUrl() {
        const query = encodeURIComponent(this.query)
        return `https://${this.lang}.wikipedia.org/w/index.php?search=${query}`
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
  input {
    box-sizing: border-box;
    width: 100%;
  }

  div.visit, div.search {
    display: inline-block;
    padding: 1px 15px;
    font-size: 14px;
  }
</style>
