import { endpoint } from './shared'

export const yearEndpoints = {
  create: (yyyy: number) => endpoint<void>(`year/${yyyy}`, 'POST'),
  delete: (yyyy: number) => endpoint<void>(`year/${yyyy}`, 'DELETE'),
} as const