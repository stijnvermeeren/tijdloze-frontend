<template lang="pug">
  div(v-if='isAdmin && editing')
    input(v-model='questionEdit')
    button(@click='send()') Opslaan
    button(@click='cancel()') Terug
  div(v-else)
    .question
      | {{questionEdit}}
      |
      button(v-if='isAdmin' @click='editing = true') Aanpassen
</template>

<script>
  export default {
    name: "PollQuestion",
    props: ['question', 'pollId', 'isAdmin'],
    data() {
      return {
        questionEdit: this.question,
        editing: false,
        submitting: false
      }
    },
    watch: {
      question() {
        this.questionEdit = this.question
      }
    },
    methods: {
      async send() {
        this.submitting = true;
        const data = {
          question: this.questionEdit
        };
        const poll = await this.$axios.$put(`poll/${this.pollId}`, data);
        this.submitting = false;
        this.editing = false;
      },
      cancel() {
        this.questionEdit = this.question;
        this.editing = false;
      }
    }
  }
</script>

<style lang="scss" scoped>
  div.question {
    font-weight: bold;
  }

  input {
    width: 100%;
  }
</style>
