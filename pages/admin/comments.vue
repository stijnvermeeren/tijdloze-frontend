<template lang="pug">
  div
    h2 Verwijderde reacties terugzetten

    comment(v-for='comment in comments' :key='comment.id' :comment='comment' @restored="reload()")
    div(v-if="!comments.length") Geen verwijderde reacties
</template>

<script>
  import Comment from '~/components/comments/Comment'

  export default {
    components: {Comment},
    methods: {
      async reload() {
        this.comments = await this.$axios.$get(`comments/deleted`)
      }
    },
    async asyncData({ app }) {
      return {
        comments: await app.$axios.$get(`comments/deleted`)
      };
    },
    middleware: 'admin',
    head: {
      title: 'Admin: verwijderde reacties terugzetten'
    }
  }
</script>
