import { defineStore } from 'pinia'

type PollVote = { pollId: number, answerId: number }
type PollData = Record<string, unknown>

export const usePollStore = defineStore('poll', () => {
  const votes = ref<PollVote[]>([])
  const currentPoll = ref<PollData | undefined>(undefined)

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
