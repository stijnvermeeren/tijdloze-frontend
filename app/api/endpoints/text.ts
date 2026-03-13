import type { TextUpdateRequest, TextValueResponse } from '../contracts/text'
import { endpoint } from './shared'

export const textEndpoints = {
  analysis: (yyyy: number) => endpoint<TextValueResponse>(`text/analysis_${yyyy}`),
  byKey: (key: string) => endpoint<TextValueResponse>(`text/${key}`),
  chatOn: () => endpoint<TextValueResponse>('text/chatOn'),
  commentsOn: () => endpoint<TextValueResponse>('text/commentsOn'),
  updateAnalysis: (yyyy: number) => endpoint<void, TextUpdateRequest>(`text/analysis_${yyyy}`, 'POST'),
  updateByKey: (key: string) => endpoint<void, TextUpdateRequest>(`text/${key}`, 'POST'),
} as const