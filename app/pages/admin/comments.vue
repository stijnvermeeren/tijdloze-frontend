<template lang="pug">
Title Admin: verwijderde reacties terugzetten
div
  h2 Verwijderde reacties terugzetten

  comments-display(v-for='comment in comments' :key='comment.id' :comment='comment' @restored="reload()")
  div(v-if="!comments.length") Geen verwijderde reacties
</template>

<script setup>
definePageMeta({
  middleware: 'admin'
})

const {data: comments, refresh: reload} = await useFetch(
    `comments/deleted`,
    useFetchOpts({key: `comments/deleted`})
)
</script>
