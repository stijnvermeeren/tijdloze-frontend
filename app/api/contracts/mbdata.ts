export interface MBDatasetHit {
  recordingMBId: string
  workMBId?: string
  matchedAlias: string
  title: string
  language?: string
  leadVocals?: string
  albumTitle: string
  releaseYear: number
  isSingle: boolean
  isSoundtrack: boolean
  albumMBId: string
  name: string
  artistMBId: string
  countryId: string
  secondArtistName?: string
  secondArtistMBId?: string
  secondArtistCountryId?: string
  score: number
}

export interface MBDatasetSearchResponse {
  hit?: MBDatasetHit
}