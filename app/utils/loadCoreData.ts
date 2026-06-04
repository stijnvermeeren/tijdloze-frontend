import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import { apiEndpoints } from '~/api/endpoints'
import {useRepo} from "pinia-orm";
import type { CoreDataResponse } from '~/api/contracts/core-data'

interface ApplyCoreDataOptions {
  flushLists?: boolean
}

export function applyCoreDataResponse(
  coreDataResponse: CoreDataResponse,
  options: ApplyCoreDataOptions = {}
) {
  const flushLists = options.flushLists ?? false

  useRootStore().coreDataId = coreDataResponse.id
  useRootStore().exitSongIds = coreDataResponse.exitSongIds;
  useYearStore().yearsRaw = coreDataResponse.years

  const albums = coreDataResponse.albums.map(album => ({
    ...album,
    isSingle: album.isSingle ?? false,
    isSoundtrack: album.isSoundtrack ?? false
  }))

  const lists = coreDataResponse.lists.map(list => ({
    ...list,
    songIds: list.songIds.map(id => id ?? undefined),
    attributions: list.attributions ?? {}
  }))

  useRepo(Artist).insert(coreDataResponse.artists)
  useRepo(Album).insert(albums)
  useRepo(Song).insert(coreDataResponse.songs)

  if (flushLists) {
    useRepo(List).flush()
  }
  useRepo(List).insert(lists)
}

export async function reloadCoreData() {
  const { $api } = useNuxtApp()
  const coreDataResponse = await $api(apiEndpoints.coreData.root())

  applyCoreDataResponse(coreDataResponse)
}