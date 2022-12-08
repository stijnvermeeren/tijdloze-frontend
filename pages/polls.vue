<template lang="pug">
  div
    h2 Tijdloze {{currentYear.yyyy}}: polls
    div(v-for='poll in currentYearPolls' :key='poll.id')
      poll(:poll='poll')
    div(v-if='!currentYearPolls.length')
      | Nog geen polls...
</template>

<script>
  import _ from 'lodash'
  import Poll from "../components/Poll";

  export default {
    components: {Poll},
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      currentYearPolls() {
        return this.polls.filter(poll => poll.year === this.currentYear.yyyy && !poll.isDeleted)
      }
    },
    async asyncData({ app }) {
      return {
        polls: await app.$axios.$get(`poll/list`)
      };
    },
    head: {
      title: 'Polls'
    },
    ssrComputedCache: true
  }
</script>
