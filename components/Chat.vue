<template>
  <div>
    <div class="messages">
      <div v-for="message in messages">
        <strong>{{message.userId}}</strong>: {{message.message}}
      </div>
      <div v-if="loading">
        Chat wordt geladen...
      </div>
    </div>
    <div class="input">
      <input v-model="message" @keypress.enter="send()" />
      <button @click="send()" :disabled="sending || !message.length">Verzenden</button>
    </div>
  </div>
</template>

<script>
  export default {
    name: "Chat",
    data() {
      return {
        messages: [],
        loading: true,
        lastId: 0,
        message: '',
        sending: false,
      }
    },
    methods: {
      async load() {
        const messages  = await this.$axios.$get('/chat/message', { params: { since: this.lastId } });
        this.loading = false;
        this.messages = _.concat(this.messages, messages);

        const lastMessage = _.last(this.messages);
        if (lastMessage) {
          this.lastId = lastMessage.id;
        }

        setTimeout(this.load, 3000);
      },
      async send() {
        if (this.message.length && !this.sending) {
          this.sending = true;
          const data = {
            message: this.message
          };
          await this.$axios.$post('/chat/message', data);
          this.message = '';
          this.sending = false;
        }

      }
    },
    mounted() {
      this.load();
    }
  }
</script>

<style scoped>

</style>
