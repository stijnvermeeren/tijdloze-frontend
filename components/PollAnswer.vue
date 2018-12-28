<template>
  <div v-if="isAdmin && editing" class="answer">
    <input v-model="answerEdit" />
    <button @click="send()">Opslaan</button>
    <button @click="cancel()">Terug</button>
  </div>
  <div v-else>
    <div class="answer">
      {{answerEdit}}
      <button v-if="isAdmin" @click="editing = true">Aanpassen</button>
    </div>
  </div>
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
