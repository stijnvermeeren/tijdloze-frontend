<template>
    <div>
        <h2>Admin: polls</h2>

        <div>
          <button @click="refresh()" :disabled="refreshing">Opnieuw laden</button>
        </div>

        <template v-for="{year, polls} in groupedPolls">
          <h3>{{year}}</h3>
          <div v-for="poll in polls" :key="poll.id">
            <poll :poll="poll" :is-admin="true" />
          </div>
        </template>
    </div>
</template>

<script>
  import Poll from '~/components/Poll'

  export default {
    components: {Poll},
    data() {
      return {
        refreshing: false
      }
    },
    computed: {
      groupedPolls() {
        return [2018, 2017, 2016, 2015].map(year => {
          return {
            year: year,
            polls: this.polls.filter(poll => poll.year === year)
          }
        })
      }
    },
    methods: {
      async refresh() {
        this.refreshing = true;
        this.polls = await this.$axios.$get(`poll/list`);
        this.refreshing = false;
      }
    },
    async asyncData({ app }) {
      return {
        polls: await app.$axios.$get(`poll/list`)
      };
    },
    middleware: 'admin',
    head: {
      title: 'Admin: Polls'
    }
  }
</script>
