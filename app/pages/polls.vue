<template lang="pug">
Title Polls
div
  h2 Tijdloze {{currentYear.yyyy}}: polls
  div(v-for='poll in currentYearPolls' :key='poll.id')
    poll(:poll='poll')
  div(v-if='!currentYearPolls.length')
    | Nog geen polls...
</template>

<script setup>
const {data: polls} = await useFetch(`poll/list`, useFetchOpts())

const {currentYear} = storeToRefs(useYearStore())

const currentYearPolls = computed(() => {
  return polls.value.filter(poll => poll.year === currentYear.value.yyyy && !poll.isDeleted)
})
</script>
