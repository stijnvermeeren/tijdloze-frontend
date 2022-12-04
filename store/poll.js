
export const state = () => ({
  votes: [],
  currentPoll: undefined
})

export const getters = {
  vote: (state) => (pollId) => {
    const vote = state.votes.find(vote => vote.pollId === pollId);
    return vote ? vote.answerId : undefined;
  }
}

export const mutations = {
  setVotes(state, votes) {
    state.votes = votes
  },
  setCurrentPoll(state, poll) {
    state.currentPoll = poll
  }
}
