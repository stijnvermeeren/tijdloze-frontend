export interface AlbumFormData {
  title: string
  artistId: number
  musicbrainzId?: string
  releaseYear: number
  isSingle: boolean
  isSoundtrack: boolean
  notes?: string
  urlWikiNl?: string
  urlWikiEn?: string
  urlAllMusic?: string
  wikidataId?: string
}

export interface AlbumData extends AlbumFormData {
  id: number
}