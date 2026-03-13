import type { ListEntryCreateRequest } from '../contracts/list-entry'
import { endpoint } from './shared'

export const listEntryEndpoints = {
  create: (yyyy: number, position: number) => endpoint<void, ListEntryCreateRequest>(`list-entry/${yyyy}/${position}`, 'POST'),
  delete: (yyyy: number, position: number) => endpoint<void>(`list-entry/${yyyy}/${position}`, 'DELETE'),
} as const