<template lang="pug">
.pager
  | Pagina {{page}} van {{pages}}
  template(v-if='page > 1')
    |
    | -
    |
    nuxt-link( :to='`/reacties`') eerste
    |
    | -
    |
    nuxt-link(:to='pagePath(page - 1)') vorige
  template(v-if='page < pages')
    |
    | -
    |
    nuxt-link(:to='pagePath(page + 1)') volgende
</template>

<script>
  export default {
    props: {
      page: Number,
      pages: Number
    },
    methods: {
      pagePath(page) {
        if (page > 1) {
          return `/reacties/${page}`
        } else {
          return "/reacties"
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  div.pager {
    text-align: right;
  }
</style>
