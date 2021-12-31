<template lang="pug">
  .chat
    .header
      span(v-if='changeName')
        input(v-model='displayNameEdit' placeholder='Kies een gebruikersnaam' @keypress.enter='saveDisplayName()')
        button(@click='saveDisplayName()' :disabled='!displayNameValid || savingDisplayName') Wijzigen
        button(@click='cancelDisplayName()') Terug
        | .
      span(v-else) Hallo #[strong {{currentUser.displayName}}] (#[a(@click='changeName = true') naam veranderen]).
      |
      | Er zijn {{online.length}} aanwezigen in de chat
      span(v-if='!showAllOnline')
        |  (
        a(@click='showAllOnline = true') toon iedereen
        | )
      | .
    .online(v-if='showAllOnline')
      | Online
      |
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
          .systemMessage(v-else)
            | {{message.message}}
        div(v-if='error' class="systemMessage")
          | De verbinding met de chat werd verbroken. Even geduld. Zodra de chat weer bereikbaar is, verbinden we je automatisch opnieuw.
        div(v-else-if='!connected' class="systemMessage")
          | Even geduld terwijl we je verbinden met de chat...
        div(v-else-if='uppercaseMessage' class="systemMessage")
          | Gelieve niet met overdreven veel hoofdletters te schrijven in de chat.
    .input
      input(v-model='message' @keypress.enter='send()' placeholder='Schrijf je berichtje...' maxlength='500')
      button(@click='send()' :disabled='sendDisabled') {{sendButtonMessage}}
</template>

<script>
  import Vue from 'vue'
  import _ from 'lodash'
  import User from "./User";
  import Sockette from 'sockette';

  export default {
    name: "Chat",
    components: {User},
    data() {
      return {
        messages: [],
        online: [],
        displayNames: {},
        connected: false,
        error: false,
        closing: false,
        postDelay: 0,
        lastId: 0,
        message: '',
        showAllOnline: false,
        changeName: false,
        displayNameEdit: this.$store.state.auth.user.displayName,
        savingDisplayName: false
      }
    },
    computed: {
      sendDisabled() {
        return !this.message.length || this.uppercaseMessage || !this.connected || this.error || this.postDelay > 0;
      },
      sendButtonMessage() {
        const dots = ".".repeat(this.postDelay)
        return `Verzenden${dots}`;
      },
      uppercaseMessage() {
        const lowercase = this.message.replaceAll(/[^a-z]/g, "").length;
        const uppercase = this.message.replaceAll(/[^A-Z]/g, "").length;
        return uppercase > (lowercase + uppercase) / 3 + 2;
      },
      onlineSorted() {
        return _.sortBy(
          this.online,
          onlineUser => onlineUser.displayName.toLowerCase()
        )
      },
      currentUser() {
        return this.$store.state.auth.user;
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
        this.$store.commit('auth/setUser', user);
        // TODO replace this
        // await this.loadOnlineOnce();
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
      addMessage(message) {
        this.messages.push(message);

        if (this.messages.length > 1000) {
          this.messages = this.messages.slice(500);
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
      loadOnline(online) {
        online.forEach(onlineUser => {
          if (this.displayNames[onlineUser.id] !== onlineUser.displayName) {
            if (this.displayNames[onlineUser.id]) {
              this.addMessage({
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
          this.addMessage({
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
      async send() {
        if (!this.sendDisabled) {
          this.ws.json({ message: this.message });
          this.message = '';

          this.postDelay = 3;
          setTimeout(()=>{
            this.decreasePostDelay();
          }, 500);
        }
      },
      decreasePostDelay() {
        console.log("Decrease")
        if (this.postDelay > 0) {
          this.postDelay--;
          setTimeout(()=>{
            this.decreasePostDelay();
          }, 500);
        }
      },
      async reconnect() {
        if (this.ws) {
          this.ws.close()
        }

        this.$axios.$get('chat/ticket').then(ticketResponse => {
          if (!this.closing) {
            this.ws = new Sockette(this.$url.websocket(`ws/chat?ticket=${ticketResponse.ticket}`), {
              timeout: 5e3,
              maxAttempts: 1,
              onopen: e => {
                this.error = false
                this.connected = true
              },
              onmessage: e => {
                const data = JSON.parse(e.data)
                if (data.message) {
                  this.addMessage(data)
                } else {
                  this.loadOnline(data)
                }
              },
              onreconnect: e => {
                // properly reconnect with a new ticket
                this.ws.close()
                this.reconnect()
              },
              onmaximum: e => {},
              onclose: e => {
                this.connected = false

                if (!this.closing) {
                  // Unless we are leaving the page, try to reconnect after the websocket is closed
                  this.reconnect()
                }
              },
              onerror: e => {
                this.error = true
              }
            });
          }
        }).catch(error => {
          console.log("Unable to obtain ticket for chat.")
          this.error = true;
          setTimeout(this.reconnect, 5000)
        })
      }
    },
    async created() {
      this.reconnect()
    },
    destroyed: function() {
      this.closing = true
      this.ws.close()
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
      padding: 4px 0;

      div.messagesContainer {
        display: flex;
        flex-flow: column;
        width: 100%;
        /* justify-content: flex-end; DO NOT USE: breaks scrolling */

        > :first-child {
          margin-top: auto !important;
          /* use !important to prevent breakage from child margin settings */
        }

        div {
          padding: 2px 10px 2px 20px;
          text-indent: -10px;

          span.userName {
            font-weight: bold;
          }

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
          color: #777777;
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
