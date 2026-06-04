import type { CrawlEntry, CrawlType } from '../contracts/crawl-process'
import { endpoint } from './shared'

export const crawlProcessEndpoints = {
  accept: (type: CrawlType, id: number) => endpoint<void>(`crawl-${type}/${id}`, 'POST'),
  next: (type: CrawlType) => endpoint<CrawlEntry | null>(`crawl-${type}`),
  reject: (type: CrawlType, id: number) => endpoint<void>(`crawl-${type}/${id}`, 'DELETE'),
} as const