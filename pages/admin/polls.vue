<template lang="pug">
div
  div.flexTitle
    h2 Admin: polls
    el-button(@click='refresh()' :disabled='refreshing' size="small" round) Opnieuw laden
  el-card
    div.header(slot="header")
      div.title Maak een nieuwe poll ({{currentYear.yyyy}})
    div
      h4 Vraag
      div
        input(v-model='question')
      h4 Antwoorden
        |
        el-button(@click="answers.push({text: ''})" size="small") Nog een antwoord
        el-button(v-if='answers.length > 2' @click='answers.pop()' size="small") Laatste antwoord verwijderen
      ul(v-for='answer in answers')
        li
          input(v-model='answer.text')
      div
        el-button(@click='submit()' :disabled='!formValid' type="primary") Opslaan

  el-card(v-for='{year, polls} in groupedPolls' :key="year")
    div.header(slot="header")
      div.title {{year}}
    div(v-for='poll in polls', :key='poll.id')
      poll(:poll='poll', :is-admin='true')
</template>

<script>
  import Poll from '~/components/Poll'

  export default {
    components: {Poll},
    data() {
      return {
        refreshing: false,
        question: '',
        answers: [{text: ''}, {text: ''}],
        submitting: false
      }
    },
    computed: {
      currentYear() {
        return this.$store.getters.currentYear;
      },
      groupedPolls() {
        const pollYears = this.$store.getters.years.filter(year => year.yyyy >= 2015);
        return pollYears.reverse().map(year => {
          return {
            year: year.yyyy,
            polls: this.polls.filter(poll => poll.year === year.yyyy)
          }
        })
      },
      formValid() {
        return !this.submitting && this.question && this.answers.every(answer => answer.text);
      }
    },
    methods: {
      async refresh() {
        this.refreshing = true;
        this.polls = await this.$axios.$get(`poll/list`);
        this.refreshing = false;
      },
      async submit() {
        this.submitting = true;
        const data = {
          question: this.question,
          answers: this.answers.map(answer => answer.text),
          year: this.currentYear.yyyy
        };
        await this.$axios.$post('poll', data);
        await this.refresh();
        this.question = '';
        this.answers = [{text: ''}, {text: ''}];
        this.submitting = false;
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

<style lang="scss" scoped>
  input {
    width: 100%;
  }

  button {
    margin: 0 10px;
  }
</style>
