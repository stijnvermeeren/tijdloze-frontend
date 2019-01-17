<template lang="pug">
  .chat
    .header
      span(v-if='changeName')
        input(v-model='displayNameEdit' placeholder='Kies een gebruikersnaam' @keypress.enter='saveDisplayName()')
        button(@click='saveDisplayName()' :disabled='!displayNameValid || savingDisplayName') Wijzigen
        button(@click='cancelDisplayName()') Terug
        | .
      span(v-else='') Hallo #[strong {{currentUser.displayName}}] (#[a(@click='changeName = true') naam veranderen]).
      | Er zijn {{online.length}} aanwezigen in de chat #[span(v-if='!showAllOnline') (#[a(@click='showAllOnline = true') toon iedereen])].
    .online(v-if='showAllOnline')
      | Online
      a(@click='showAllOnline = false') (lijst verbergen)
      | :
      div(v-for='onlineUser in onlineSorted' :class="['user', {isAdmin: onlineUser.isAdmin}]")
        user(:user='onlineUser')
    .messages(ref='messages')
      .messagesContainer
        template(v-for='message in messages')
          div(v-if='message.userId' :title='message.created' :class='{myMessage: message.userId === currentUser.id, isAdmin: isAdmin(message.userId)}')
            span.userName
              user(:user='messageUser(message)')
            | : {{message.message}}
          .systemMessage(v-else='')
            | {{message.message}}
        div(v-if='initialLoad')
          | Chat wordt geladen...
    .input
      input(v-model='message' @keypress.enter='send()' placeholder='Schrijf je berichtje...' maxlength='500')
      button(@click='send()' :disabled='sending || !message.length') Verzenden
</template>

<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import User from "./User";

  export default {
    name: "Chat",
    components: {User},
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
        loadOnlineTimeout: undefined,
        showAllOnline: false,
        changeName: false,
        displayNameEdit: this.$store.state.user.displayName,
        savingDisplayName: false
      }
    },
    computed: {
      messageIds() {
        return new Set(this.messages.map(message => message.id))
      },
      onlineSorted() {
        return _.sortBy(
          this.online,
          onlineUser => onlineUser.displayName.toLowerCase()
        )
      },
      currentUser() {
        return this.$store.state.user;
      }
    },
    watch: {
      'currentUser.displayName'() {
        this.displayNameEdit = this.currentUser.displayName;
      },
      showAllOnline() {
        this.autoScroll();
      }
    },
    methods: {
      displayNameValid() {
        this.displayNameEdit.trim().length > 0;
      },
      async saveDisplayName() {
        this.savingDisplayName = true;
        const data = {
          displayName: this.displayNameEdit.trim()
        };
        const user = await this.$axios.$post(`user/display-name`, data);
        this.$store.commit('setUser', user);
        await this.loadOnlineOnce();
        this.savingDisplayName = false;
        this.changeName = false;
      },
      cancelDisplayName() {
        this.changeName = false;
        this.displayNameEdit = this.currentUser.displayName;
      },
      displayName(userId, fallback) {
        const savedName = this.displayNames[userId];
        return savedName ? savedName : fallback;
      },
      isAdmin(userId) {
        const user = this.online.find(user => user.id === userId);
        return user ? user.isAdmin : false;
      },
      messageUser(message) {
        const user = this.online.find(user => user.id === message.userId);
        if (user) {
          return user;
        } else {
          return {
            id: message.userId,
            displayName: this.displayName(message.userId, message.displayName),
            isAdmin: false
          };
        }
      },
      async loadOnce() {
        const messages  = await this.$axios.$get('/chat/message', {
          params: { since: this.lastId },
          progress: false
        });
        const newMessages = messages.filter(message => !this.messageIds.has(message.id));
        this.messages = _.concat(this.messages, newMessages);

        if (this.messages.length > 1000) {
          this.messages = this.messages.slice(500);
        }

        const lastMessage = _.last(this.messages);
        if (lastMessage) {
          this.lastId = lastMessage.id;
        }

        this.autoScroll();
      },
      autoScroll() {
        const elem = this.$refs['messages'];

        // auto-scroll if within 100px from bottom
        if (elem.scrollHeight - elem.clientHeight - elem.scrollTop < 50) {
          Vue.nextTick(() => {
            elem.scrollTop = elem.scrollHeight;
          });
        }
      },
      async load() {
        this.loadOnce();
        this.loadMessagesTimeout = setTimeout(this.load, 3000);
      },
      async loadOnlineOnce() {
        const online = await this.$axios.$get('/chat/online', {
          progress: false
        });

        online.forEach(onlineUser => {
          if (this.displayNames[onlineUser.id] !== onlineUser.displayName) {
            if (this.displayNames[onlineUser.id]) {
              this.messages.push({
                message: `"${this.displayNames[onlineUser.id]}" heeft nu als nieuwe naam "${onlineUser.displayName}".`
              })
            }

            this.displayNames[onlineUser.id] = onlineUser.displayName;
          }
        });

        const onlineIds = online.map(onlineUser => onlineUser.id);
        const previouslyOnlineIds = this.online.map(onlineUser => onlineUser.id);

        const stillOnline = online
          .filter(onlineUser => previouslyOnlineIds.includes(onlineUser.id));

        const newOnline = online
          .filter(onlineUser => !previouslyOnlineIds.includes(onlineUser.id));

        if (previouslyOnlineIds.includes(this.currentUser.id) && newOnline.length > 0) {
          const names = newOnline.map(onlineUser => onlineUser.displayName).join(", ");
          this.messages.push({
            message: `Nieuw in de chat: ${names}.`
          })
        }

        let currentUser = [];
        if (!onlineIds.includes(this.currentUser.id)) {
          currentUser = [{
            id: this.currentUser.id,
            displayName: this.currentUser.displayName
          }]
        }

        this.online = _.concat(currentUser, newOnline, stillOnline);
      },
      async loadOnline() {
        this.loadOnlineOnce();
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
    height: calc(100vh - 200px);
    border: 1px solid grey;

    div.header {
      background-color: @inputBackgroundColor;
      padding: 4px 8px;
      border-bottom: 1px solid grey;
      text-align: left;
      font-size: 14px;

      input {
        width: 150px;
      }
    }

    div.online {
      background-color: @inputBackgroundColor;
      padding: 4px 8px;
      border-bottom: 1px solid grey;
      text-align: left;
      font-size: 14px;

      max-height: 4em;
      overflow: auto;

      div.user {
        display: inline-block;
        border: 1px solid lightgray;
        border-radius: 4px;
        padding: 1px 4px;
        margin: 1px 4px;
        white-space: nowrap;

        &.isAdmin {
          color: darkred;
        }
      }
    }

    div.messages {
      display: flex;
      overflow: auto;

      flex: 1;
      padding: 4px 8px;

      div.messagesContainer {
        min-height: min-content;
        display: flex;
        flex-flow: column;
        justify-content: flex-end;

        span.userName {
          font-weight: bold;
        }

        div.isAdmin {
          span.userName {
            color: darkred;
          }
        }

        div.myMessage {
          background-color: @inputBackgroundColor;
        }

        div.systemMessage {
          font-style: italic;
        }
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
