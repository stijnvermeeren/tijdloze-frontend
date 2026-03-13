export interface AuthUser {
  id: string
  isAdmin: boolean
  isBlocked: boolean
  displayName?: string
  name?: string
  email?: string
}

export interface UserSyncRequest {
  name?: string
  firstName?: string
  lastName?: string
  nickname?: string
  email?: string
  emailVerified?: boolean
}

export interface DisplayNameRequest {
  displayName: string
}

export interface UserListItem {
  id: string
  name?: string
  displayName?: string
  created: string
  lastSeen: string
  isAdmin: boolean
  isBlocked: boolean
}