import { endpoint } from './shared'

export const listExitEndpoints = {
  add: (yyyy: number, songId: number) => endpoint<void>(`list-exit/${yyyy}/${songId}`, 'POST'),
  clear: (yyyy: number) => endpoint<void>(`list-exit/${yyyy}`, 'DELETE'),
  remove: (yyyy: number, songId: number) => endpoint<void>(`list-exit/${yyyy}/${songId}`, 'DELETE'),
} as const