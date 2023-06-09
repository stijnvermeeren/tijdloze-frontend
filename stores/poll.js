import { defineStore } from 'pinia'

export const usePollStore = defineStore('poll', {
  state: () => ({
    votes: [],
    currentPoll: undefined
  }),
  getters: {
    vote: (state) => (pollId) => {
      const vote = state.votes.find(vote => vote.pollId === pollId);
      return vote ? vote.answerId : undefined;
    }
  },
  actions: {
    setVotes(votes) {
      this.votes = votes
    },
    setCurrentPoll(poll) {
      this.currentPoll = poll
    }
  }
})
