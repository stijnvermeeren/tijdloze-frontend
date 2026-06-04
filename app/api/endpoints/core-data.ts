import type { CoreDataIdResponse, CoreDataResponse } from '../contracts/core-data'
import { endpoint } from './shared'

export const coreDataEndpoints = {
  id: () => endpoint<CoreDataIdResponse>('core-data/id'),
  root: () => endpoint<CoreDataResponse>('core-data'),
} as const