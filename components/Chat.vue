<template>
  <div class="chat">
    <div class="messages" ref="messages">
      <div v-for="message in messages" :key="message.id">
        <strong>{{message.userId}}</strong>: {{message.message}}
      </div>
      <div v-if="initialLoad">
        Chat wordt geladen...
      </div>
    </div>
    <div class="input">
      <input v-model="message" @keypress.enter="send()" placeholder="Schrijf je berichtje..." />
      <button @click="send()" :disabled="sending || !message.length">Verzenden</button>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'

  export default {
    name: "Chat",
    data() {
      return {
        messages: [],
        initialLoad: true,
        loading: false,
        lastId: 0,
        message: '',
        sending: false,
      }
    },
    computed: {
      messageIds() {
        return new Set(this.messages.map(message => message.id))
      }
    },
    methods: {
      async loadOnce() {
        const messages  = await this.$axios.$get('/chat/message', { params: { since: this.lastId } });
        const newMessages = messages.filter(message => !this.messageIds.has(message.id));
        this.messages = _.concat(this.messages, newMessages);

        const lastMessage = _.last(this.messages);
        if (lastMessage) {
          this.lastId = lastMessage.id;
        }

        const elem = this.$refs['messages'];

        // auto-scroll if within 100px from bottom
        if (elem.scrollHeight - elem.clientHeight - elem.scrollTop < 100) {
          Vue.nextTick(() => {
            elem.scrollTop = elem.scrollHeight;
          });
        }
      },
      async load() {
        this.loadOnce();
        setTimeout(this.load, 3000);
      },
      async send() {
        if (this.message.length && !this.sending) {
          this.sending = true;
          const data = {
            message: this.message
          };
          await this.$axios.$post('/chat/message', data);
          await this.loadOnce();
          this.message = '';
          this.sending = false;
        }
      }
    },
    async mounted() {
      await this.load();
      this.initialLoad = false;
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  div.chat {
    display: flex;
    flex-flow: column;
    min-height: 300px;
    height: calc(100vh - 220px);
    border: 1px solid grey;

    div.messages {
      display: flex;
      flex-flow: column;
      justify-content: flex-end;

      flex: 1;
      overflow: auto;

      padding: 4px 8px;

      div {
      }
    }

    div.input {
      display: flex;
      flex-flow: row;
      border-top: 1px solid grey;

      input {
        margin: 4px 5px;
        padding: 3px 8px;
        flex: 1;
        background-color: @inputBackgroundColor;
      }

      button {
        padding: 4px 8px;
        margin: 2px 5px;
      }
    }
  }
</style>
