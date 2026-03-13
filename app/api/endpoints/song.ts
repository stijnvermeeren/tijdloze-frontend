import type { SongCreateData, SongFormData } from '../contracts/song'
import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const songEndpoints = {
  byId: (songId: number) => endpoint<SongFormData>(`song/${songId}`),
  create: () => endpoint<ApiIdResponse, SongCreateData>('song', 'POST'),
  delete: (songId: number) => endpoint<void>(`song/${songId}`, 'DELETE'),
  update: (songId: number) => endpoint<void, SongFormData>(`song/${songId}`, 'PUT'),
} as const