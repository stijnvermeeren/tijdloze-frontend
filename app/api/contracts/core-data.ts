export interface CoreDataArtist {
  id: number
  name: string
  aliases?: string
  countryId?: string
}

export interface CoreDataAlbum {
  id: number
  title: string
  artistId: number
  releaseYear: number
  cover?: string
  isSingle: boolean
  isSoundtrack: boolean
}

export interface CoreDataSong {
  id: number
  title: string
  aliases?: string
  artistId: number
  secondArtistId?: number
  albumId?: number
  languageId?: string
  leadVocals?: string
  spotifyId?: string
  recordingMBId?: string
  workMBId?: string
  positions: Record<string, number>
}

export interface CoreDataList {
  year: number
  songIds: Array<number | null>
  attributions?: Record<string, string>
}

export interface CoreDataResponse {
  id: number
  exitSongIds: number[]
  years: number[]
  artists: CoreDataArtist[]
  albums: CoreDataAlbum[]
  songs: CoreDataSong[]
  lists: CoreDataList[]
}

export interface CoreDataIdResponse {
  id: number
}