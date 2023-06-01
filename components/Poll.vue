<template lang="pug">
.poll
  div.reload
    el-button(icon="el-icon-refresh-left" @click="reload" :loading="isLoading" circle)
  poll-question(:question='livePoll.question' :poll-id='livePoll.id' :is-admin='isAdmin')
  div(v-if='showResults')
    div(v-for='answer in livePoll.answers' :class="['answer', {myVote: answer.id === myVote}]")
      .answerVotes
        span.bar(:style="{width: barWidth(answer.voteCount) + 'px'}")
        span.count {{percentage(answer.voteCount)}}
      .answerText
        poll-answer(:answer='answer.answer' :poll-id='livePoll.id' :poll-answer-id='answer.id' :is-admin='isAdmin')
  div(v-else)
    .answer(v-for='answer in livePoll.answers')
      input(type='radio' v-model='myVoteEdit' :value='answer.id' :id='`vote-${answer.id}`')
      label(:for='`vote-${answer.id}`') {{answer.answer}}
    div(v-if='isAuthenticated')
      button(@click='vote()' :disabled='!myVoteEdit || voting') Stem afgeven
    div(v-else)
      | Om te kunnen stemmen, moet je je #[a(@click='login()') aanmelden/registeren].
  .voteCount {{voteCount}} {{ voteCount === 1 ? 'stem' : 'stemmen' }}
  div(v-if='isAdmin')
    .isDeleted(v-if='isDeleted')
      | Poll is verborgen op de website.
      |
      button(@click='restore()' :disabled='deleting') Opnieuw tonen
    div(v-else)
      button(@click='deletePoll()' :disabled='deleting') Poll verbergen op de website
</template>

<script>
  import _ from 'lodash';
  import PollQuestion from "./PollQuestion";
  import PollAnswer from "./PollAnswer";
  import {usePollStore} from "~/stores/poll";
  import {useAuthStore} from "~/stores/auth";

  export default {
    name: "Poll",
    components: {PollAnswer, PollQuestion},
    props: {
      poll: {
        type: Object
      },
      isAdmin: {
        type: Boolean,
        default: false
      },
      isActive: {
        type: Boolean,
        default: false
      }
    },
    data() {
      return {
        livePoll: this.poll,
        isDeleted: this.poll.isDeleted,
        deleting: false,
        voting: false,
        myVoteEdit: undefined,
        isLoading: false
      }
    },
    computed: {
      showResults() {
        return this.isAdmin || !!this.myVote
      },
      myVote() {
        return usePollStore().vote(this.poll.id)
      },
      isAuthenticated() {
        return useAuthStore().isAuthenticated;
      },
      voteCount() {
        return _.sumBy(this.livePoll.answers, answer => answer.voteCount);
      }
    },
    watch: {
      poll(newPoll) {
        this.livePoll = newPoll
      },
      myVote() {
        this.reload()
      }
    },
    methods: {
      async reload() {
        this.isLoading = true;
        const result = await useApiFetch(`poll/my-votes`);
        usePollStore().setVotes(result.votes);
        this.livePoll = await useApiFetch(`poll/${this.poll.id}`);
        this.isLoading = false;
      },
      async vote() {
        if (this.isAuthenticated) {
          this.voting = true;
          await this.$axios.$post(`poll/${this.poll.id}/${this.myVoteEdit}`);

          await this.reload();
          this.voting = false;
        }
      },
      barWidth(answerVotes) {
        return 150 * answerVotes / this.voteCount;
      },
      percentage(answerVotes) {
        if (this.voteCount) {
          return Math.round(100 * answerVotes / this.voteCount) + '%';
        } else {
          return '-';
        }
      },
      async deletePoll() {
        this.deleting = true;
        await this.$axios.$post(`poll/${this.poll.id}/hide`);
        this.isDeleted = true;
        this.deleting = false;
      },
      async restore() {
        this.deleting = true;
        await this.$axios.$delete(`poll/${this.poll.id}/hide`);
        this.isDeleted = false;
        this.deleting = false;
      },
      login() {
        this.$auth.login(this.$route.path);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @use "../assets/styleConfig";

  div.poll {
    margin: 10px 0;
    padding: 5px 10px;
    border: 1px solid grey;
    background-color: styleConfig.$inputBackgroundColor;

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
          background-color: styleConfig.$headerBackgroundColor;
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
