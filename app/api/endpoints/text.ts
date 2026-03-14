import type { TextUpdateRequest, TextValueResponse } from '../contracts/text'
import type Year from '../../orm/Year'
import { endpoint } from './shared'

export const textKey = {
  chatOn: 'chatOn',
  commentsOn: 'commentsOn',
} as const

export type TextStaticKey = (typeof textKey)[keyof typeof textKey]
export type TextAnalysisKey = `analysis_${number}`
export type TextKey = TextStaticKey | TextAnalysisKey

export function analysisKey(year: Year): TextAnalysisKey {
  return `analysis_${year.yyyy}`
}

export const textEndpoints = {
  byKey: (key: TextKey) => endpoint<TextValueResponse>(`text/${key}`),
  updateByKey: (key: TextKey) => endpoint<void, TextUpdateRequest>(`text/${key}`, 'POST'),
} as const