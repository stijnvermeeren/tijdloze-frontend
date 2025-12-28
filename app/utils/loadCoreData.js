import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import {useRepo} from "pinia-orm";

export async function reloadCoreData() {
  const coreDataResponse = await useNuxtApp().$api('core-data')
  useRootStore().exitSongIds = coreDataResponse.exitSongIds
  useYearStore().yearsRaw = coreDataResponse.years

  useRepo(Artist).save(coreDataResponse.artists);
  useRepo(Album).save(coreDataResponse.albums);
  useRepo(Song).save(coreDataResponse.songs);
  useRepo(List).save(coreDataResponse.lists);
}