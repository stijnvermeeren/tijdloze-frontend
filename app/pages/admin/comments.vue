<template lang="pug">
Title Admin: verwijderde reacties terugzetten
div
  h2 Verwijderde reacties terugzetten

  comments-display(v-for='comment in comments || []' :key='comment.id' :comment='comment' @restored="reload()")
  div(v-if="!(comments || []).length") Geen verwijderde reacties
</template>

<script setup lang="ts">
import { apiEndpoints } from '~/api/endpoints'
import { queryKeys } from '~/api/queryKeys'

definePageMeta({
  middleware: 'admin'
})

const {data: comments, refresh: reload} = await useApiFetch(
  apiEndpoints.comment.deleted(),
  { key: queryKeys.comments.deleted }
)
</script>
