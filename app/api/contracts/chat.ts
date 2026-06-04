export interface ChatUser {
  id: string
  displayName: string
  isAdmin: boolean
  isBlocked: boolean
}

export interface ChatTicketResponse {
  ticket: string
}