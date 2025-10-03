<template lang="pug">
.chat
  .header
    span(v-if='changeName')
      v-text-field(v-model='displayNameEdit' placeholder='Kies een gebruikersnaam' @keypress.enter='saveDisplayName()' hide-details)
      v-btn(@click='saveDisplayName()' :disabled='!displayNameValid || savingDisplayName') Wijzigen
      v-btn(@click='cancelDisplayName()') Terug
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
      chat-user(:user='onlineUser')
  .messages(ref='messagesContainer')
    .messagesContainer
      template(v-for='message in messages')
        div(
          v-if='message.userId' 
          :title="useDateFormat(message.created, { format: 'D MMMM YYYY, H:mm:ss'})"
          :class='{myMessage: message.userId === currentUser.id, isAdmin: isAdmin(message.userId)}'
        )
          span.userName
            chat-user(:user='messageUser(message)')
          | : {{message.message}}
        .systemMessage(v-else)
          | {{message.message}}
  .input
    v-text-field(v-model='message' @keypress.enter='send()' label='Schrijf je berichtje...' maxlength='500' hide-details)
    v-btn(@click='send()' :disabled='sendDisabled') {{sendButtonMessage}}
  .belowInputMessage
    div(v-if='error')
      | De verbinding met de chat werd verbroken. Even geduld. Zodra de chat weer bereikbaar is, verbinden we je automatisch opnieuw.
    div(v-else-if='!connected')
      | Even geduld terwijl we je verbinden met de chat...
    div(v-else-if='uppercaseMessage')
      | Gelieve niet met overdreven veel hoofdletters te schrijven in de chat.
</template>

<script setup>
import Sockette from 'sockette';
import {useAuthStore} from "~/stores/auth";
import sortBy from 'ramda/src/sortBy';

const {$api, $url} = useNuxtApp()

const messages = ref([])
const online = ref([])
const displayNames = ref({})
const connected = ref(false)
const error = ref(false)
const closing = ref(false)
const postDelay = ref(0)
const lastId = ref(0)
const message = ref('')
const showAllOnline = ref(false)
const changeName = ref(false)
const displayNameEdit = ref(useAuthStore().user.displayName)
const savingDisplayName = ref(false)
const initialTicketBackoff = 5000  // milliseconds
const ticketBackoff = ref(initialTicketBackoff)
const ws = ref(undefined)

const messagesContainer = useTemplateRef('messagesContainer')

const sendButtonMessage = computed(() => {
  const dots = ".".repeat(postDelay.value)
  return `Verzenden${dots}`;
})
const uppercaseMessage = computed(() => {
  const lowercase = message.value.replaceAll(/[^a-z]/g, "").length;
  const uppercase = message.value.replaceAll(/[^A-Z]/g, "").length;
  return uppercase > (lowercase + uppercase) / 3 + 2;
})
const sendDisabled = computed(() => {
  return !message.value.length || uppercaseMessage.value || !connected.value || error.value || postDelay.value > 0;
})
const onlineSorted = computed(() => {
  return sortBy(onlineUser => onlineUser.displayName.toLowerCase())(online.value);
})
const currentUser = computed(() => {
  return useAuthStore().user;
})
const displayNameValid = computed(() => {
  return displayNameEdit.value.trim().length > 0;
})

watch(() => currentUser.value.displayName, () => {
  displayNameEdit.value = currentUser.value.displayName;
})
watch(showAllOnline, () => {
  autoScroll();
})

async function saveDisplayName() {
  savingDisplayName.value = true;
  const data = {
    displayName: displayNameEdit.value.trim()
  };
  useAuthStore().user = await $api(`user/display-name`, useFetchOptsPost(data));
  // TODO replace this
  // await this.loadOnlineOnce();
  savingDisplayName.value = false;
  changeName.value = false;
}

function cancelDisplayName() {
  changeName.value = false;
  displayNameEdit.value = currentUser.value.displayName;
}

function displayName(userId, fallback) {
  const savedName = displayNames.value[userId];
  return savedName ? savedName : fallback;
}

function isAdmin(userId) {
  const user = online.value.find(user => user.id === userId);
  return user ? user.isAdmin : false;
}

function messageUser(message) {
  const user = online.value.find(user => user.id === message.userId);
  if (user) {
    return user;
  } else {
    return {
      id: message.userId,
      displayName: displayName(message.userId, message.displayName),
      isAdmin: false
    };
  }
}

function addMessage(message) {
  messages.value.push(message);

  if (messages.value.length > 1000) {
    messages.value = messages.value.slice(500);
  }

  autoScroll();
}

function autoScroll() {
  const elem = messagesContainer.value;

  // auto-scroll if within 100px from bottom
  if (elem.scrollHeight - elem.clientHeight - elem.scrollTop < 50) {
    nextTick(() => {
      elem.scrollTop = elem.scrollHeight;
    });
  }
}

function loadOnline(newOnlineData) {
  newOnlineData.forEach(onlineUser => {
    if (displayNames.value[onlineUser.id] !== onlineUser.displayName) {
      if (displayNames.value[onlineUser.id]) {
        addMessage({
          message: `"${displayNames.value[onlineUser.id]}" heeft nu als nieuwe naam "${onlineUser.displayName}".`
        })
      }

      displayNames.value[onlineUser.id] = onlineUser.displayName;
    }
  });

  const onlineIds = newOnlineData.map(onlineUser => onlineUser.id);
  const previouslyOnlineIds = online.value.map(onlineUser => onlineUser.id);

  const stillOnline = newOnlineData.filter(onlineUser => previouslyOnlineIds.includes(onlineUser.id));

  const newOnline = newOnlineData
    .filter(onlineUser => !previouslyOnlineIds.includes(onlineUser.id));

  if (previouslyOnlineIds.includes(currentUser.value.id) && newOnline.length > 0) {
    const names = newOnline.map(onlineUser => onlineUser.displayName).join(", ");
    addMessage({
      message: `Nieuw in de chat: ${names}.`
    })
  }

  let currentUserEntry = [];
  if (!onlineIds.includes(currentUser.value.id)) {
    currentUserEntry = [{
      id: currentUser.value.id,
      displayName: currentUser.value.displayName
    }]
  }

  online.value = [...currentUserEntry, ...newOnline, ...stillOnline];
}
async function send() {
  if (!sendDisabled.value) {
    ws.value.json({ message: message.value });
    message.value = '';

    postDelay.value = 3;
    setTimeout(()=>{
      decreasePostDelay();
    }, 500);
  }
}

function decreasePostDelay() {
  if (postDelay.value > 0) {
    postDelay.value--;
    setTimeout(()=>{
      decreasePostDelay();
    }, 500);
  }
}

async function reconnect() {
  if (ws.value) {
    ws.value.close()
  }

  const ticketResponse = await $api('chat/ticket').catch(err => {
    console.log("Unable to obtain ticket for chat.")
    error.value = true;
    ticketBackoff.value = ticketBackoff.value * 1.5  // exponential backoff
    setTimeout(reconnect, ticketBackoff.value)
  })

  if (!closing.value && ticketResponse) {
    ticketBackoff.value = initialTicketBackoff
    ws.value = new Sockette($url.websocket(`ws/chat?ticket=${ticketResponse.ticket}`), {
      timeout: 5e3,
      maxAttempts: 1,
      onopen: e => {
        error.value = false
        connected.value = true
      },
      onmessage: e => {
        const data = JSON.parse(e.data)
        if (data.message) {
          addMessage(data)
        } else {
          loadOnline(data)
        }
      },
      onreconnect: e => {
        // properly reconnect with a new ticket
        ws.value.close()
        reconnect()
      },
      onmaximum: e => {},
      onclose: e => {
        connected.value = false

        if (!closing.value) {
          // Unless we are leaving the page, try to reconnect after the websocket is closed
          reconnect()
        }
      },
      onerror: e => {
        error.value = true
      }
    });
  }
}

onMounted(() => {
  reconnect()
})
onBeforeUnmount(() => {
  closing.value = true
  ws.value.close()
})
</script>

<style lang="scss" scoped>
  @use "../../assets/styleConfig";

  div.chat {
    display: flex;
    flex-flow: column;
    min-height: 300px;
    height: calc(100vh - 200px);
    border: 1px solid grey;
    border-radius: 4px;

    div.header {
      background-color: styleConfig.$inputBackgroundColor;
      padding: 4px 8px;
      border-bottom: 1px solid grey;
      border-radius: 4px 4px 0 0;
      text-align: left;
      font-size: 14px;

      input {
        width: 150px;
      }
    }

    div.online {
      background-color: styleConfig.$inputBackgroundColor;
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
          /* reduce right margin when `scrollbar-gutter: stable;` becomes supported be browsers */
          padding: 2px 25px 2px 20px;
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
          background-color: styleConfig.$inputBackgroundColor;
        }

        div.systemMessage {
          font-size: 70%;
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
        background-color: styleConfig.$inputBackgroundColor;
        font-size: 16px;
        border-radius: 4px;
        border: 2px solid grey;
        box-shadow: 0 0 1px 1px grey inset;
      }

      button {
        padding: 4px 8px;
        margin: 2px 5px;
        font-size: 16px;
      }
    }

    div.belowInputMessage div {
      font-size: 80%;
      color: #aa2222;
      margin: 5px 8px;
    }
  }
</style>
