import { defineStore } from 'pinia'
import type { PollRecord, PollVote } from '~/api/contracts'

export const usePollStore = defineStore('poll', () => {
  const votes = ref<PollVote[]>([])
  const currentPoll = ref<PollRecord | undefined>(undefined)

  function vote(pollId: number): number | undefined {
    const vote = votes.value.find(vote => vote.pollId === pollId);
    return vote ? vote.answerId : undefined;
  }

  return {
    currentPoll,
    vote,
    votes
  }
})
