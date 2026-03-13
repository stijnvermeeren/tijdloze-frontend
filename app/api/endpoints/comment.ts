import type {
  CommentCountResponse,
  CommentCreateRequest,
  CommentItem,
  CommentUpdateRequest,
  FullComment,
  ThreadSummary,
} from '../contracts/comment'
import { endpoint } from './shared'

export const commentEndpoints = {
  count: () => endpoint<CommentCountResponse>('comments/count'),
  create: () => endpoint<void, CommentCreateRequest>('comment', 'POST'),
  deleted: () => endpoint<CommentItem[]>('comments/deleted'),
  delete: (commentId: number) => endpoint<void>(`comment/${commentId}`, 'DELETE'),
  full: (commentId: number) => endpoint<FullComment>(`comment/${commentId}/full`),
  list: (page: number) => endpoint<ThreadSummary[]>(`comments/${page}`),
  restore: (commentId: number) => endpoint<void>(`comment/${commentId}`, 'POST'),
  update: (commentId: number) => endpoint<void, CommentUpdateRequest>(`comment/${commentId}`, 'PUT'),
} as const