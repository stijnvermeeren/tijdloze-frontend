import { defineStore } from 'pinia'

export const usePollStore = defineStore('poll', () => {
  const votes = ref([])
  const currentPoll = ref(undefined)

  function vote(pollId) {
    const vote = votes.value.find(vote => vote.pollId === pollId);
    return vote ? vote.answerId : undefined;
  }

  return {
    currentPoll,
    vote,
    votes
  }
})
