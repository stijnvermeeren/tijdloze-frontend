<template lang="pug">
  .answer(v-if='isAdmin && editing')
    input(v-model='answerEdit')
    button(@click='send()') Opslaan
    button(@click='cancel()') Terug
  div(v-else='')
    .answer
      | {{answerEdit}}
      button(v-if='isAdmin' @click='editing = true') Aanpassen
</template>

<script>
  export default {
    name: "PollAnswer",
    props: ['answer', 'pollId', 'pollAnswerId', 'isAdmin'],
    data() {
      return {
        answerEdit: this.answer,
        editing: false,
        submitting: false
      }
    },
    watch: {
      answer() {
        this.answerEdit = this.answer
      }
    },
    methods: {
      async send() {
        this.submitting = true;
        const data = {
          answer: this.answerEdit
        };
        await this.$axios.$put(`poll/${this.pollId}/${this.pollAnswerId}`, data);
        this.submitting = false;
        this.editing = false;
      },
      cancel() {
        this.answerEdit = this.answer;
        this.editing = false;
      }
    }
  }
</script>

<style lang="less" scoped>
  input {
    width: 100%;
  }
</style>
