import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import { apiEndpoints } from '~/api/endpoints'
import {useRepo} from "pinia-orm";

export async function reloadCoreData() {
  const { $api } = useNuxtApp()
  const coreDataResponse = await $api(apiEndpoints.coreData.root())

  useRootStore().coreDataId = coreDataResponse.id
  useRootStore().exitSongIds = coreDataResponse.exitSongIds;
  useYearStore().yearsRaw = coreDataResponse.years

  useRepo(Artist).save(coreDataResponse.artists);
  useRepo(Album).save(coreDataResponse.albums);
  useRepo(Song).save(coreDataResponse.songs);
  useRepo(List).save(coreDataResponse.lists);
}