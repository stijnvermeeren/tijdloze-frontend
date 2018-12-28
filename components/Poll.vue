<template>
  <div class="poll">
    <div class="question">{{poll.question}}</div>
    <div v-for="answer in poll.answers" class="answer">
      <div class="answerVotes">
        <span class="bar" :style="{width: barWidth(answer.voteCount) + 'px'}"></span>
        <span class="count">{{percentage(answer.voteCount)}}%</span>
      </div>
      <div class="answerText">{{answer.answer}}</div>
    </div>
    <div class="voteCount">{{voteCount}} stemmen</div>
  </div>
</template>

<script>
  import _ from 'lodash';

  export default {
    name: "Poll",
    props: ['poll'],
    computed: {
      voteCount() {
        return _.sumBy(this.poll.answers, answer => answer.voteCount);
      }
    },
    methods: {
      barWidth(answerVotes) {
        return 150 * answerVotes / this.voteCount;
      },
      percentage(answerVotes) {
        return Math.round(100 * answerVotes / this.voteCount);
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

    div.question {
      font-weight: bold;
    }

    div.answer {
      margin: 4px 0;

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
        display: inline-block;
      }
    }

    div.voteCount {
      font-size: 14px;
    }
  }
</style>
