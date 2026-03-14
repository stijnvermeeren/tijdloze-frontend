import type { SongData, SongFormData } from '../contracts/song'
import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const songEndpoints = {
  byId: (songId: number) => endpoint<SongData>(`song/${songId}`),
  create: () => endpoint<ApiIdResponse, SongFormData>('song', 'POST'),
  delete: (songId: number) => endpoint<void>(`song/${songId}`, 'DELETE'),
  update: (songId: number) => endpoint<void, SongFormData>(`song/${songId}`, 'PUT'),
} as const