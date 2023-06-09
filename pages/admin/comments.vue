<template lang="pug">
Title Admin: verwijderde reacties terugzetten
div
  h2 Verwijderde reacties terugzetten

  comments-display(v-for='comment in comments' :key='comment.id' :comment='comment' @restored="reload()")
  div(v-if="!comments.length") Geen verwijderde reacties
</template>

<script>
  export default defineNuxtComponent({
    setup() {
      definePageMeta({
        middleware: 'admin'
      })
    },
    methods: {
      async reload() {
        const { data: comments } = await useApiFetch(`comments/deleted`)
        this.comments = comments
      }
    },
    async asyncData() {
      const { data: comments } = await useApiFetch(`comments/deleted`)
      return {comments};
    }
  })
</script>
