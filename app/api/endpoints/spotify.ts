import type { SpotifyTrack } from '../contracts/spotify'
import { endpoint } from './shared'

export const spotifyEndpoints = {
  find: () => endpoint<SpotifyTrack[]>('spotify/find'),
} as const