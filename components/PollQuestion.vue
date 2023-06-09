<template lang="pug">
div.d-flex(v-if='isAdmin && editing')
  v-text-field(v-model='questionEdit' density="compact" hide-details)
  v-btn(@click='send()') Opslaan
  v-btn(@click='cancel()') Terug
div(v-else)
  .question
    | {{questionEdit}}
    |
    v-btn(v-if='isAdmin' @click='editing = true' size="x-small") Aanpassen
</template>

<script>
  export default {
    name: "PollQuestion",
    props: {
      question: String,
      pollId: Number,
      isAdmin: Boolean
    },
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
</style>
