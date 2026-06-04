import type { ApiIdResponse } from '../contracts/shared'
import { endpoint } from './shared'

export const musicbrainzEndpoints = {
  albumById: (musicbrainzId: string) => endpoint<ApiIdResponse>(`album/musicbrainz/${musicbrainzId}`),
  artistById: (musicbrainzId: string) => endpoint<ApiIdResponse>(`artist/musicbrainz/${musicbrainzId}`),
  crawlAlbumDetails: () => endpoint<void>('musicbrainz/crawl-album-details'),
  crawlArtistDetails: () => endpoint<void>('musicbrainz/crawl-artist-details'),
  crawlSongDetails: () => endpoint<void>('musicbrainz/crawl-song-details'),
  crawlSongs: () => endpoint<void>('musicbrainz/crawl-songs'),
} as const