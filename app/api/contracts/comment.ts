export interface CommentItem {
  id: number
  userId?: string
  name: string
  isAdmin?: boolean
  created: string
  updated: string
  message: string
  deleted?: boolean
}

export interface FullComment extends CommentItem {
  replies: CommentItem[]
}

export interface CommentCountResponse {
  commentCount: number
}

export interface ThreadSummary {
  mainComment: CommentItem
  lastReply1?: CommentItem
  lastReply2?: CommentItem
  replyCount: number
}

export interface CommentCreateRequest {
  message: string
  parentId?: number
}

export interface CommentUpdateRequest {
  message: string
}