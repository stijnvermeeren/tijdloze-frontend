<template lang="pug">
Title Polls
div
  h2 Tijdloze {{currentYear?.yyyy}}: polls
  div(v-for='poll in currentYearPolls' :key='poll.id')
    poll(:poll='poll')
  div(v-if='!currentYearPolls.length')
    | Nog geen polls...
</template>

<script setup lang="ts">
import type { PollRecord } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'

const {data: polls} = await useApiFetch(apiEndpoints.poll.list())

const {currentYear} = storeToRefs(useYearStore())

const currentYearPolls = computed<PollRecord[]>(() => {
  const year = currentYear.value
  if (!year) {
    return []
  }
  return (polls.value ?? []).filter((poll) => poll.year === year.yyyy && !poll.isDeleted)
})
</script>
