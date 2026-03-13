export interface ArtistCreateData {
  name: string
  countryId?: string
  musicbrainzId?: string
}

export interface ArtistFormData {
  id: number
  name: string
  aliases?: string
  countryId?: string
  notes?: string
  urlOfficial?: string
  urlWikiNl?: string
  urlWikiEn?: string
  urlAllMusic?: string
  wikidataId?: string
  spotifyId?: string
  musicbrainzId?: string
}