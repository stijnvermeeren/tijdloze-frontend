<template lang="pug">
Title Polls
div
  h2 Tijdloze {{currentYear.yyyy}}: polls
  div(v-for='poll in currentYearPolls' :key='poll.id')
    poll(:poll='poll')
  div(v-if='!currentYearPolls.length')
    | Nog geen polls...
</template>

<script>
  import {useRootStore} from "~/stores/root";

  export default defineNuxtComponent({
    computed: {
      currentYear() {
        return useRootStore().currentYear;
      },
      currentYearPolls() {
        return this.polls.filter(poll => poll.year === this.currentYear.yyyy && !poll.isDeleted)
      }
    },
    async asyncData() {
      const {data: polls} = await useApiFetch(`poll/list`)
      return {polls}
    }
  })
</script>
