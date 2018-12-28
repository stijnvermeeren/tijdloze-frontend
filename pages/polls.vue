<template>
    <div>
        <h2>Tijdloze 2018: polls</h2>

        <div v-for="poll in polls">
            <poll :poll="poll" />
        </div>
    </div>
</template>

<script>
  import _ from 'lodash'
  import Poll from "../components/Poll";

  export default {
    components: {Poll},
    computed: {
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
