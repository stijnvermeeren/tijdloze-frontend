<template>
  <div class="chat">
    <div class="online">
      Online: <span v-for="onlineUser in onlineSorted">{{onlineUser.displayName}}</span>
    </div>
    <div class="messages" ref="messages">
      <div v-for="message in messages" :key="message.id" :title="message.created">
        <strong>{{displayName(message.userId, message.displayName)}}</strong>: {{message.message}}
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
  import _ from 'lodash'

  export default {
    name: "Chat",
    data() {
      return {
        messages: [],
        online: [],
        displayNames: {},
        initialLoad: true,
        loading: false,
        lastId: 0,
        message: '',
        sending: false,
        loadMessagesTimeout: undefined,
        loadOnlineTimeout: undefined
      }
    },
    computed: {
      messageIds() {
        return new Set(this.messages.map(message => message.id))
      },
      onlineSorted() {
        return _.sortBy(this.online, onlineUser => onlineUser.displayName.toLowerCase())
      },
      currentUser() {
        return this.$store.state.user;
      }
    },
    methods: {
      displayName(userId, fallback) {
        const savedName = this.displayNames[userId];
        return savedName ? savedName : fallback;
      },
      async loadOnce() {
        const messages  = await this.$axios.$get('/chat/message', {
          params: { since: this.lastId },
          progress: false
        });
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
        this.loadMessagesTimeout = setTimeout(this.load, 3000);
      },
      async loadOnline() {
        const online = await this.$axios.$get('/chat/online', {
          progress: false
        });

        online.forEach(onlineUser => {
          this.displayNames[onlineUser.id] = onlineUser.displayName;
        });

        const onlineIds = online.map(onlineUser => onlineUser.id);
        const previouslyOnlineIds = this.online.map(onlineUser => onlineUser.id);

        const stillOnline = online
          .filter(onlineUser => previouslyOnlineIds.includes(onlineUser.id));
        const newOnline = online.filter(onlineUser => !previouslyOnlineIds.includes(onlineUser.id));

        let currentUser = [];
        if (!onlineIds.includes(this.currentUser.id)) {
          currentUser = [{
            id: this.currentUser.id,
            displayName: this.currentUser.displayName
          }]
        }

        this.online = _.concat(currentUser, newOnline, stillOnline);

        this.loadOnlineTimeout = setTimeout(this.loadOnline, 15000);
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
      await this.loadOnline();
      this.initialLoad = false;
    },
    destroyed: function() {
      if (this.loadMessagesTimeout) {
        clearTimeout(this.loadMessagesTimeout);
      }
      if (this.loadOnlineTimeout) {
        clearTimeout(this.loadOnlineTimeout);
      }
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

    div.online {
      background-color: @inputBackgroundColor;
      padding: 4px 8px;
      border-bottom: 1px solid grey;

      span {
        border: 1px solid lightgray;
        border-radius: 4px;
        padding: 1px 4px;
        margin: 1px 4px;
      }
    }

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
        font-size: 16px;
      }

      button {
        padding: 4px 8px;
        margin: 2px 5px;
        font-size: 16px;
      }
    }
  }
</style>
