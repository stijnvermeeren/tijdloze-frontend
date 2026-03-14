import type { ArtistData, ArtistFormData } from '../contracts/artist'
import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const artistEndpoints = {
  byId: (artistId: number) => endpoint<ArtistData>(`artist/${artistId}`),
  create: () => endpoint<ApiIdResponse, ArtistFormData>('artist', 'POST'),
  delete: (artistId: number) => endpoint<void>(`artist/${artistId}`, 'DELETE'),
  update: (artistId: number) => endpoint<void, ArtistFormData>(`artist/${artistId}`, 'PUT'),
} as const