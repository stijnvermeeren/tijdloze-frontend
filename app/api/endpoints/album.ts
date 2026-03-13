import type { AlbumCreateData, AlbumFormData } from '../contracts/album'
import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const albumEndpoints = {
  byId: (albumId: number) => endpoint<AlbumFormData>(`album/${albumId}`),
  create: () => endpoint<ApiIdResponse, AlbumCreateData>('album', 'POST'),
  delete: (albumId: number) => endpoint<void>(`album/${albumId}`, 'DELETE'),
  update: (albumId: number) => endpoint<void, AlbumFormData>(`album/${albumId}`, 'PUT'),
} as const