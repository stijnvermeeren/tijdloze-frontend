<template lang="pug">
  div
    div
      textarea(:disabled='submitting' cols='60' placeholder='Schrijf een nieuwe reactie...' rows='4' v-model='editMessage')
    div
      button.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
        | Bericht wijzigen
</template>

<script>
  export default {
    props: ['commentId', 'message'],
    data() {
      return {
        editMessage: this.message,
        submitting: false,
      }
    },
    computed: {
      invalidMessage() {
        return this.editMessage.length === 0;
      }
    },
    methods: {
      submit() {
        this.submitting = true;

        const data = {
          message: this.editMessage
        };
        this.$axios.$put(`comment/${this.commentId}`, data).then(response => {
          this.submitting = false;
          this.$emit('submitted', this.editMessage);
        });
      }
    }
  }
</script>

<style lang="scss" scoped>
  textarea {
    width: 100%;
    font-size: 100%;
    padding: 4px 8px;
    box-sizing: border-box;
  }
</style>
