import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import {useRepo} from "pinia-orm";

interface CoreDataArtist {
  id: number
  name: string
  aliases: string | null
  countryId: string | null
}

interface CoreDataAlbum {
  id: number
  title: string
  artistId: number
  releaseYear: number
  cover: string | null
  isSingle: boolean
  isSoundtrack: boolean
}

interface CoreDataSong {
  id: number
  title: string
  aliases: string | null
  artistId: number
  secondArtistId: number | null
  albumId: number | null
  languageId: string | null
  leadVocals: string | null
  spotifyId?: string | null
  recordingMBId?: string | null
  workMBId?: string | null
  positions: Record<string, number>
}

interface CoreDataList {
  year: number
  songIds: Array<number | null>
  attributions: Record<string, string> | null
}

interface CoreDataResponse {
  id: number
  exitSongIds: number[]
  years: number[]
  artists: CoreDataArtist[]
  albums: CoreDataAlbum[]
  songs: CoreDataSong[]
  lists: CoreDataList[]
}

export async function reloadCoreData() {
  const coreDataResponse = await useNuxtApp().$api<CoreDataResponse>('core-data')

  useRootStore().coreDataId = coreDataResponse.id
  useRootStore().exitSongIds = coreDataResponse.exitSongIds;
  useYearStore().yearsRaw = coreDataResponse.years

  useRepo(Artist).save(coreDataResponse.artists);
  useRepo(Album).save(coreDataResponse.albums);
  useRepo(Song).save(coreDataResponse.songs);
  useRepo(List).save(coreDataResponse.lists);
}