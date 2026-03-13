import { apiEndpoints } from '~/api/endpoints'

export const queryKeys = {
  comments: {
    count: apiEndpoints.comment.count().path,
    deleted: apiEndpoints.comment.deleted().path,
    homepage: 'comments',
    page: (page: number) => apiEndpoints.comment.list(page).path,
  },
  text: {
    chatOn: apiEndpoints.text.chatOn().path,
    commentsOn: apiEndpoints.text.commentsOn().path,
  },
} as const
