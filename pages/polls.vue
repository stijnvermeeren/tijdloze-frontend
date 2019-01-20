<template lang="pug">
  div
    h2 Tijdloze 2018: polls
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
      currentYearPolls() {
        return this.polls.filter(poll => poll.year === 2018 && !poll.isDeleted)
      }
    },
    async asyncData({ app }) {
      return {
        polls: await app.$axios.$get(`poll/list`)
      };
    },
    head: {
      title: 'Polls'
    }
  }
</script>
