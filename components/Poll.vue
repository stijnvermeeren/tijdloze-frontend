<template>
  <div class="poll">
    <poll-question :question="livePoll.question" :poll-id="livePoll.id" :is-admin="isAdmin" />
    <div v-if="showResults">
      <div
        v-for="answer in livePoll.answers"
        :class="['answer', {myVote: answer.id === myVote}]"
      >
        <div class="answerVotes">
          <span class="bar" :style="{width: barWidth(answer.voteCount) + 'px'}"></span>
          <span class="count">{{percentage(answer.voteCount)}}</span>
        </div>
        <div class="answerText">
          <poll-answer
              :answer="answer.answer"
              :poll-id="livePoll.id"
              :poll-answer-id="answer.id"
              :is-admin="isAdmin"
          />
        </div>
      </div>
    </div>
    <div v-else>
      <div v-for="answer in livePoll.answers" class="answer">
        <input type="radio" v-model="myVoteEdit" :value="answer.id" :id="`vote-${answer.id}`" />
        <label :for="`vote-${answer.id}`">{{answer.answer}}</label>
      </div>
      <div><button @click="vote()" :disabled="!myVoteEdit || voting">Stem afgeven</button></div>
    </div>

    <div class="voteCount">{{voteCount}} stemmen</div>
    <div v-if="isAdmin">
      <div v-if="isDeleted" class="isDeleted">
        Poll is verborgen op de website.
        <button @click="restore()" :disabled="deleting">Opnieuw tonen</button>
      </div>
      <div v-else>
        <button @click="deletePoll()" :disabled="deleting">Poll verbergen op de website</button>
      </div>
    </div>
  </div>
</template>

<script>
  import _ from 'lodash';
  import PollQuestion from "./PollQuestion";
  import PollAnswer from "./PollAnswer";

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
        myVoteEdit: undefined
      }
    },
    computed: {
      showResults() {
        return !!this.myVote
      },
      myVote() {
        return this.$store.getters.pollVote(this.poll.id)
      },
      isAuthenticated() {
        return this.$store.getters.isAuthenticated;
      },
      voteCount() {
        return _.sumBy(this.poll.answers, answer => answer.voteCount);
      }
    },
    methods: {
      async vote() {
        if (this.isAuthenticated) {
          this.voting = true;
          await this.$axios.$post(`poll/${this.poll.id}/${this.myVoteEdit}`);

          const result = await this.$axios.$get(`poll/my-votes`);
          this.$store.commit('setPollVotes', result.votes);

          this.livePoll = this.$axios.$get(`poll/${this.poll.id}`);
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
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  div.poll {
    margin: 10px 0;
    padding: 5px 10px;
    border: 1px solid grey;
    background-color: @inputBackgroundColor;


    div.answer {
      display: flex;
      flex-direction: row;
      align-items: center;

      margin: 4px 0;

      &.myVote {
        div.answerVotes {
          span.bar {
            background-color: red;
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
        padding: 0 3px;
        font-size: 12px;

        span.bar {
          position: absolute;
          left: 0;
          top: 0;
          bottom: 0;
          background-color: @headerBackgroundColor;
          z-index: -1;
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
