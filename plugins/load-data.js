import {useRootStore} from "~/stores/root";
import {useConfigStore} from "~/stores/config";
import {usePollStore} from "~/stores/poll";
import _ from "lodash";
import Song from "~/orm/Song";
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import List from "~/orm/List";
import {useRepo} from "pinia-orm";

export default defineNuxtPlugin(async nuxtApp => {
  const rootStore = useRootStore()
  const yearStore = useYearStore()
  const configStore = useConfigStore()
  const $api = nuxtApp.$api

  if (!yearStore.years.length) {
    const [
      chatOnResponse,
      commentsOnResponse,
      coreDataResponse
    ] = await Promise.all([
      $api(`text/chatOn`),
      $api(`text/commentsOn`),
      $api('core-data')
    ])
    configStore.chatOn = (chatOnResponse.value === 'on')
    configStore.commentsOn = (commentsOnResponse.value === 'on')
    rootStore.exitSongIds.value = coreDataResponse.exitSongIds
    yearStore.setYearsRaw(coreDataResponse.years)

    useRepo(Artist).insert(coreDataResponse.artists);
    useRepo(Album).insert(coreDataResponse.albums);
    useRepo(Song).insert(coreDataResponse.songs);

    // for some reason, flush is necessary to avoid getting stale data on the SSR-generated page
    useRepo(List).flush();
    useRepo(List).insert(coreDataResponse.lists);

    if (rootStore.listInProgress) {
      const poll = await $api('poll/latest')
          .catch(err => undefined);
      if (poll && poll.year === yearStore.currentYear.yyyy) {
        usePollStore().currentPoll = poll;
      }
    }
  }
});
