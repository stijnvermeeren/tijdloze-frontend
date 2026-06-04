export interface SongFormData {
  title: string
  aliases?: string
  artistId: number
  secondArtistId?: number
  albumId: number
  languageId?: string
  leadVocals?: string
  notes?: string
  lyrics?: string
  urlWikiNl?: string
  urlWikiEn?: string
  spotifyId?: string
  musicbrainzRecordingId?: string
  musicbrainzWorkId?: string
  wikidataId?: string
}

export interface SongData extends SongFormData {
  id: number
}