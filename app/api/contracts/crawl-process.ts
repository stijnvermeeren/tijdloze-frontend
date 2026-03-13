export type CrawlType = 'artist' | 'album' | 'song'

export interface CrawlEntry {
  id: number
  artistId?: number
  albumId?: number
  songId?: number
  field: string
  value?: string
  comment?: string
  crawlDate?: string
}