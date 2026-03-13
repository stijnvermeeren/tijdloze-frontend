<template lang="pug">
div.poll
  div.reload
    v-btn(:icon="mdiRefresh" size="small" density="comfortable" @click="reload" :loading="isLoading")
  poll-question(v-model='livePoll.question' :poll-id='livePoll.id' :is-admin='isAdmin')
  div(v-if='showResults')
    div(v-for='answer in livePoll.answers' :class="['answer', {myVote: answer.id === myVote}]")
      .answerVotes
        span.bar(:style="{width: barWidth(answer.voteCount) + 'px'}")
        span.count {{percentage(answer.voteCount)}}
      .answerText
        poll-answer(v-model='answer.answer' :poll-id='livePoll.id' :poll-answer-id='answer.id' :is-admin='isAdmin')
  div(v-else)
    v-radio-group(v-model='myVoteEdit' hide-details)
      v-radio.answer(
        v-for='answer in livePoll.answers'
        :key='answer.id'
        :value='answer.id'
        :label="answer.answer"
        density="compact"
      )
    div(v-if='isAuthenticated')
      v-btn(@click='vote()' :disabled='!myVoteEdit || voting') Stem afgeven
    div(v-else)
      | Om te kunnen stemmen, moet je je #[a(@click='login()') aanmelden/registeren].
  .voteCount {{voteCount}} {{ voteCount === 1 ? 'stem' : 'stemmen' }}
  div(v-if='isAdmin')
    .isDeleted(v-if='isDeleted')
      | Poll is verborgen op de website.
      |
      v-btn(size="x-small" @click='restore()' :disabled='deleting') Opnieuw tonen
    div(v-else)
      v-btn(size="x-small" @click='deletePoll()' :disabled='deleting') Poll verbergen op de website
</template>

<script setup lang="ts">
import {mdiRefresh} from "@mdi/js";
import type { PollAnswer, PollRecord } from '~/api/contracts'
import { apiEndpoints } from '~/api/endpoints'
import {usePollStore} from "~/stores/poll";
import {useAuthStore} from "~/stores/auth";

const auth = inject('auth', {}) // provide default value for server-side
const {$api} = useNuxtApp()

const props = withDefaults(defineProps<{
  poll: PollRecord
  isAdmin?: boolean
  isActive?: boolean
}>(), {
  isAdmin: false,
  isActive: false,
})

const livePoll = ref<PollRecord>(props.poll)
const isDeleted = ref(props.poll.isDeleted)
const deleting = ref(false)
const voting = ref(false)
const myVoteEdit = ref<number | undefined>(undefined)
const isLoading = ref(false)

const myVote = computed(() => {
  return usePollStore().vote(props.poll.id)
})

const showResults = computed(() => {
  return props.isAdmin || !!myVote.value
})

const isAuthenticated = computed(() => {
  return useAuthStore().isAuthenticated;
})

const voteCount = computed(() => {
  return livePoll.value.answers.reduce((sum: number, answer: PollAnswer) => sum + answer.voteCount, 0);
})

watch(() => props.poll, (newPoll) => {
  livePoll.value = newPoll
})

watch(myVote, () => {
  reload()
})

async function reload() {
  isLoading.value = true;
  if (isAuthenticated.value) {
    const result = await $api(apiEndpoints.poll.myVotes())
    usePollStore().votes = result.votes;
  }

  livePoll.value = await $api(apiEndpoints.poll.byId(props.poll.id))
  isLoading.value = false;
}

async function vote() {
  if (isAuthenticated.value) {
    voting.value = true;
    await $api(apiEndpoints.poll.vote(props.poll.id, myVoteEdit.value!));

    await reload();
    voting.value = false;
  }
}

function barWidth(answerVotes: number) {
  return 150 * answerVotes / voteCount.value;
}

function percentage(answerVotes: number) {
  if (voteCount.value) {
    return Math.round(100 * answerVotes / voteCount.value) + '%';
  } else {
    return '-';
  }
}

async function deletePoll() {
  deleting.value = true;
  await $api(apiEndpoints.poll.hide(props.poll.id));
  isDeleted.value = true;
  deleting.value = false;
}

async function restore() {
  deleting.value = true;
  await $api(apiEndpoints.poll.restore(props.poll.id));
  isDeleted.value = false;
  deleting.value = false;
}

function login() {
  useRouter().replace({path: '/auth/login', query: {redirect: useRoute().fullPath}});
}
</script>

<style scoped>
  @import "../../assets/styleConfig.css";

  div.poll {
    margin: 10px 0;
    padding: 5px 10px;
    border: 1px solid grey;
    background-color: var(--input-background-color);

    .reload {
      float: right;
    }

    div.answer {
      display: flex;
      flex-direction: row;
      align-items: center;

      margin: 4px 0;

      &.myVote {
        div.answerVotes {
          span.bar {
            background-color: darkorange;
          }
        }

        div.answerText {
          font-weight: bold;
        }
      }

      div.answerVotes {
        display: inline-block;
        position: relative;
        width: 150px;
        z-index: 0;
        border: 1px solid gray;
        font-size: 12px;

        span.bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: var(--header-background-color);
          z-index: -1;
        }

        span.count {
          padding-left: 3px;
        }
      }

      div.answerText {
        margin: 0 10px;
        flex: 1;
      }
    }

    div.voteCount {
      font-size: 14px;
    }

    div.isDeleted {
      color: red;
    }
  }
</style>
