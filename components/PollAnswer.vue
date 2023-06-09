<template lang="pug">
.answer(v-if='isAdmin && editing')
  v-text-field(v-model='answerEdit' density="compact" hide-details)
  v-btn(@click='send()') Opslaan
  v-btn(@click='cancel()') Terug
div(v-else)
  .answer
    | {{answerEdit}}
    |
    v-btn(v-if='isAdmin' size="x-small" @click='editing = true') Aanpassen
</template>

<script>
  export default {
    name: "PollAnswer",
    props: {
      answer: String,
      pollId: Number,
      pollAnswerId: Number,
      isAdmin: Boolean
    },
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
        await useApiFetchPut(`poll/${this.pollId}/${this.pollAnswerId}`, data);
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
