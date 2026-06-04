import { endpoint } from './shared'

export const cacheEndpoints = {
  invalidate: () => endpoint<void>('cache/invalidate'),
} as const