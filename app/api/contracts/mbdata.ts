export interface MBDatasetHit {
  songTitle: string
  spotifyId?: string
  artistName: string
  artistCountryId?: string
  artistMusicbrainzId?: string
  albumTitle: string
  albumReleaseYear?: number
  albumMusicbrainzId?: string
  albumCover?: string
}

export interface MBDatasetSearchResponse {
  hit?: MBDatasetHit
}