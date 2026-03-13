import type { ChatTicketResponse } from '../contracts/chat'
import { endpoint } from './shared'

export const chatEndpoints = {
  ticket: () => endpoint<ChatTicketResponse>('chat/ticket'),
} as const