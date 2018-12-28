<template>
  <div>
    <h2>Admin: polls</h2>

    <div>
      <button @click="refresh()" :disabled="refreshing">Opnieuw laden</button>
    </div>

    <h3>Maak een nieuwe poll</h3>
    <div>
      <div><strong>Vraag</strong></div>
      <div><input v-model="question" /></div>
      <div>
        <strong>Antwoorden</strong>
        - <a @click="answers.push({text: ''})">Nog een antwoord</a>
        <template v-if="answers.length > 2">- <a @click="answers.pop()">Laatste antwoord verwijderen</a></template>
      </div>
      <div v-for="answer in answers">
        <input v-model="answer.text" />
      </div>
      <div>
        <button @click="submit()" :disabled="!formValid">Opslaan</button>
      </div>
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
        refreshing: false,
        question: '',
        answers: [{text: ''}, {text: ''}],
        submitting: false
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
          answers: this.answers.map(answer => answer.text)
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

<style lang="less" scoped>
  input {
    width: 100%;
  }
</style>
