import type { MBDatasetSearchResponse } from '../contracts/mbdata'
import { endpoint } from './shared'

export const mbdataEndpoints = {
  crawlSongs: () => endpoint<void>('mbdata/crawl-songs'),
  searchQuery: () => endpoint<MBDatasetSearchResponse>('mbdata/search-query'),
} as const