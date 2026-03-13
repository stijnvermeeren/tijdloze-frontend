export interface AlbumCreateData {
  title: string
  artistId?: number
  musicbrainzId?: string
  releaseYear?: number
  isSingle: boolean
  isSoundtrack: boolean
}

export interface AlbumFormData {
  id: number
  title: string
  artistId: number
  releaseYear: number
  isSingle: boolean
  isSoundtrack: boolean
  notes?: string
  urlWikiNl?: string
  urlWikiEn?: string
  urlAllMusic?: string
  musicbrainzId?: string
  wikidataId?: string
}