<template>
  <div>
    <div><input v-model="url" @input="update()" /></div>
    <div v-if="value" class="visit"><a :href="value">Visit</a></div>
    <div v-if="query" class="search"><a :href="searchUrl">Search</a></div>
  </div>
</template>

<script>
  export default {
    name: 'WikiUrlInput',
    props: ['value', 'lang', 'query'],
    data() {
      return {
        url: this.value
      }
    },
    computed: {
      searchUrl() {
        const query = encodeURIComponent(this.query)
        return `https://${this.lang}.wikipedia.org/w/index.php?search=${query}`
      }
    },
    methods: {
      update() {
        console.log(this.url);
        this.$emit('input', this.url);
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
