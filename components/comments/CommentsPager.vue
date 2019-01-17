<template lang="pug">
  .pager
    | Pagina {{page}} van {{pages}} -&ensp;
    nuxt-link(v-if='page > 1' :to='`/reacties`') eerste
    | &ensp;
    nuxt-link(v-if='page > 1' :to='`/reacties?page=${page - 1}`') vorige
    | &ensp;
    nuxt-link(v-if='page < pages' :to='`/reacties?page=${page + 1}`') volgende
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
