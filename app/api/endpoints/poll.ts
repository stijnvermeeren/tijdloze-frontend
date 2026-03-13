import type {
  PollAnswerUpdateRequest,
  PollCreateRequest,
  PollQuestionUpdateRequest,
  PollRecord,
  PollVoteListResponse,
} from '../contracts/poll'
import { endpoint } from './shared'

export const pollEndpoints = {
  answer: (pollId: number, answerId: number) => endpoint<void, PollAnswerUpdateRequest>(`poll/${pollId}/${answerId}`, 'PUT'),
  byId: (pollId: number) => endpoint<PollRecord>(`poll/${pollId}`),
  create: () => endpoint<void, PollCreateRequest>('poll', 'POST'),
  hide: (pollId: number) => endpoint<void>(`poll/${pollId}/hide`, 'POST'),
  latest: () => endpoint<PollRecord>('poll/latest'),
  list: () => endpoint<PollRecord[]>('poll/list'),
  myVotes: () => endpoint<PollVoteListResponse>('poll/my-votes'),
  question: (pollId: number) => endpoint<void, PollQuestionUpdateRequest>(`poll/${pollId}`, 'PUT'),
  restore: (pollId: number) => endpoint<void>(`poll/${pollId}/hide`, 'DELETE'),
  vote: (pollId: number, answerId: number) => endpoint<void>(`poll/${pollId}/${answerId}`, 'POST'),
} as const