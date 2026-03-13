export interface SongCreateData {
  artistId: number
  secondArtistId?: number
  albumId: number
  title: string
  languageId?: string
  leadVocals?: string
  spotifyId?: string
  musicbrainzRecordingId?: string
  musicbrainzWorkId?: string
}

export interface SongFormData {
  id: number
  title: string
  aliases?: string
  artistId?: number
  secondArtistId?: number
  albumId?: number
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