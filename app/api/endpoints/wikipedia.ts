import type { WikipediaFindResponse } from '../contracts/wikipedia'
import { endpoint } from './shared'

export const wikipediaEndpoints = {
  crawl: () => endpoint<void>('wikipedia/crawl'),
  find: () => endpoint<WikipediaFindResponse>('wikipedia/find'),
} as const