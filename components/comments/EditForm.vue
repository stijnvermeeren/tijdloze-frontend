<template lang="pug">
div
  div
    v-textarea(
      :disabled='submitting'
      label='Reactie'
      rows='4'
      v-model='editMessage'
      hide-details
    )
  div
    v-btn.formsubmit(:disabled='submitting || invalidMessage' @click='submit()')
      | Bericht wijzigen
</template>

<script>
  export default {
    props: {
      commentId: Number,
      message: String
    },
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
      async submit() {
        this.submitting = true;

        const data = {
          message: this.editMessage
        };
        await $fetch(
            `comment/${this.commentId}`,
            useFetchOpts(useFetchData(data, {method: 'PUT'}))
        )
        this.submitting = false;
        this.$emit('submitted', this.editMessage)
      }
    }
  }
</script>
