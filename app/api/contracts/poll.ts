export interface PollVote {
  pollId: number
  answerId: number
}

export interface PollVoteListResponse {
  votes: PollVote[]
}

export interface PollAnswer {
  id: number
  answer: string
  voteCount: number
}

export interface PollRecord {
  id: number
  year: number
  question: string
  answers: PollAnswer[]
  isDeleted: boolean
}

export interface PollCreateRequest {
  question: string
  answers: string[]
  year: number
}

export interface PollQuestionUpdateRequest {
  question: string | undefined
}

export interface PollAnswerUpdateRequest {
  answer: string | undefined
}