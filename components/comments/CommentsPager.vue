<template>
    <div class="pager">Pagina {{page}} van {{pages}} -
        <nuxt-link v-if="page > 1" :to="`/reacties`">eerste</nuxt-link>
        <nuxt-link v-if="page > 1" :to="`/reacties?page=${page - 1}`">vorige</nuxt-link>
        <nuxt-link v-if="page < pages" :to="`/reacties?page=${page + 1}`">volgende</nuxt-link>
    </div>
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
