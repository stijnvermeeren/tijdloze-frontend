import {useRootStore} from "~/stores/root";
import {usePollStore} from "~/stores/poll";
import _ from "lodash";
import Song from "~/orm/Song";
import Album from "~/orm/Album";
import Artist from "~/orm/Artist";
import List from "~/orm/List";
import {useRepo} from "pinia-orm";
import ListEntry from "~/orm/ListEntry";

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

    const lists = coreDataResponse.lists.map(list => {
      const entries = []
      list.songIds.forEach((songId, index) => {
        if (songId) {
        const position = index + 1
          return entries.push({
            yearPosition: `${list.year}-${position}`,
            position: position,
            songId: songId
          })
        }
      })
      useRepo(ListEntry).insert(entries);
      return {
        year: list.year,
        entryIds: entries.map(entry => entry.yearPosition)
      }
    })

    // without a flush, on the server-side, we sometimes get old data back even after inserting the new data... :'(
    useRepo(List).flush()

    useRepo(List).insert(lists);

    if (rootStore.listInProgress) {
      const poll = await $api('poll/latest')
          .catch(err => undefined);
      if (poll && poll.year === rootStore.currentYear.yyyy) {
        usePollStore().setCurrentPoll(poll);
      }
    }
  }
});
