import type { AlbumData, AlbumFormData } from '../contracts/album'
import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const albumEndpoints = {
  byId: (albumId: number) => endpoint<AlbumData>(`album/${albumId}`),
  create: () => endpoint<ApiIdResponse, AlbumFormData>('album', 'POST'),
  delete: (albumId: number) => endpoint<void>(`album/${albumId}`, 'DELETE'),
  update: (albumId: number) => endpoint<void, AlbumFormData>(`album/${albumId}`, 'PUT'),
} as const