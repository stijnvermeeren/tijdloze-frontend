import type { AuthUser, DisplayNameRequest, UserListItem, UserSyncRequest } from '../contracts/user'
import { endpoint } from './shared'

export const userEndpoints = {
  block: (userId: string) => endpoint<void>(`user/${userId}/block`, 'POST'),
  current: () => endpoint<AuthUser, UserSyncRequest>('user', 'POST'),
  displayName: () => endpoint<AuthUser, DisplayNameRequest>('user/display-name', 'POST'),
  list: () => endpoint<UserListItem[]>('user/list'),
  unblock: (userId: string) => endpoint<void>(`user/${userId}/block`, 'DELETE'),
} as const