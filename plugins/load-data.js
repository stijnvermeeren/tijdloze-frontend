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

  if (!rootStore.years.length) {
    const [
      {data: chatOnResponse},
      {data: commentsOnResponse},
      {data: coreDataResponse}
    ] = await Promise.all([
      useApiFetch(`text/chatOn`),
      useApiFetch(`text/commentsOn`),
      useApiFetch('core-data')
    ])
    rootStore.setChatOn(chatOnResponse.value.value === 'on')
    rootStore.setCommentsOn(commentsOnResponse.value.value === 'on')
    rootStore.updateCoreData(coreDataResponse.value)

    useRepo(Artist).insert(coreDataResponse.value.artists);
    useRepo(Album).insert(coreDataResponse.value.albums);
    useRepo(Song).insert(coreDataResponse.value.songs);

    const lists = coreDataResponse.value.lists.map(list => {
      list.top100SongIds = _.take(list.songIds, list.top100SongCount)
      return list
    })

    // without a flush, on the server-side, we sometimes get old data back even after inserting the new data... :'(
    useRepo(List).flush()

    useRepo(List).insert(lists);

    if (rootStore.listInProgress) {
      const {data: poll} = await useApiFetch('poll/latest');
      if (poll.value && poll.value.year === rootStore.currentYear.yyyy) {
        usePollStore().setCurrentPoll(poll.value);
      }
    }
  }
});
