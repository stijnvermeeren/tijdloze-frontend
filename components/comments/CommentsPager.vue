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
      nuxt-link(:to='`/reacties?page=${page - 1}`') vorige
    template(v-if='page < pages')
      |
      | -
      |
      nuxt-link(:to='`/reacties?page=${page + 1}`') volgende
</template>

<script>
  export default {
    props: ['page', 'pages'],
    name: 'CommentsPager'
  }
</script>

<style lang="less" scoped>
  div.pager {
    text-align: right;
  }
</style>
