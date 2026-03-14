export interface ArtistFormData {
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

export interface ArtistData extends ArtistFormData {
  id: number
}