export interface ChatUser {
  id: string
  displayName: string
  isAdmin?: boolean
  isBlocked?: boolean
}

export interface ChatMessage {
  userId?: string
  displayName?: string
  message: string
  created: string
}

export interface ChatTicketResponse {
  ticket: string
}