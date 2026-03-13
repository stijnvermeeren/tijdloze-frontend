import { endpoint } from './shared'

export const wikidataEndpoints = {
  crawlAlbumDetails: () => endpoint<void>('wikidata/crawl-album-details'),
  crawlArtistDetails: () => endpoint<void>('wikidata/crawl-artist-details'),
  crawlSongDetails: () => endpoint<void>('wikidata/crawl-song-details'),
} as const