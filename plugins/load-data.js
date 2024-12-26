import {useRootStore} from "~/stores/root";
import {usePollStore} from "~/stores/poll";
import _ from "lodash";
import Song from "~/orm/Song";
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import List from "~/orm/List";
import {useRepo} from "pinia-orm";

export default defineNuxtPlugin(async nuxtApp => {
  const rootStore = useRootStore(nuxtApp.$pinia)
  const $api = nuxtApp.$api

  if (!rootStore.years.length) {
    const [
      chatOnResponse,
      commentsOnResponse,
      coreDataResponse
    ] = await Promise.all([
      $api(`text/chatOn`),
      $api(`text/commentsOn`),
      $api('core-data')
    ])
    rootStore.setChatOn(chatOnResponse.value === 'on')
    rootStore.setCommentsOn(commentsOnResponse.value === 'on')
    rootStore.updateCoreData(coreDataResponse)

    useRepo(Artist).insert(coreDataResponse.artists);
    useRepo(Album).insert(coreDataResponse.albums);
    useRepo(Song).insert(coreDataResponse.songs);
    useRepo(List).insert(coreDataResponse.lists);

    if (rootStore.listInProgress) {
      const poll = await $api('poll/latest')
          .catch(err => undefined);
      if (poll && poll.year === rootStore.currentYear.yyyy) {
        usePollStore().setCurrentPoll(poll);
      }
    }
  }
});
