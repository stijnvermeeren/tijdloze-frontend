<template>
    <div class="pager">Pagina {{page}} van {{pages}} -
        <nuxt-link v-if="page > 1" :to="`/reacties`" tag="button">eerste</nuxt-link>
        <nuxt-link v-if="page > 1" :to="`/reacties?page=${page - 1}`" tag="button">vorige</nuxt-link>
        <nuxt-link v-if="page < pages" :to="`/reacties?page=${page + 1}`" tag="button">volgende</nuxt-link>
    </div>
</template>

<script>
  export default {
    props: ['page', 'pages'],
    name: 'CommentsPager'
  }
</script>

<style scoped>
    div.pager {
        text-align: right;
    }
</style>
