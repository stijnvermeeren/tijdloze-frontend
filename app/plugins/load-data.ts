import { apiEndpoints } from "~/api/endpoints"
import { textKey } from "~/api/endpoints/text"
import { useRootStore } from "~/stores/root"
import { useConfigStore } from "~/stores/config"
import { usePollStore } from "~/stores/poll"
import type { TypedApi } from "~/api/client"
import Song from "~/orm/Song"
import Album from "~/orm/Album"
import Artist from "~/orm/Artist"
import List from "~/orm/List"
import { useRepo } from "pinia-orm"

export default defineNuxtPlugin(async (nuxtApp) => {
  const rootStore = useRootStore()
  const yearStore = useYearStore()
  const configStore = useConfigStore()
  const $api = nuxtApp.$api as TypedApi

  await callOnce(async () => {
    const [chatOnResponse, commentsOnResponse, coreDataResponse] = await Promise.all([
      $api(apiEndpoints.text.byKey(textKey.chatOn)),
      $api(apiEndpoints.text.byKey(textKey.commentsOn)),
      $api(apiEndpoints.coreData.root())
    ])

    configStore.chatOn = chatOnResponse.value === "on"
    configStore.commentsOn = commentsOnResponse.value === "on"
    rootStore.coreDataId = coreDataResponse.id
    rootStore.exitSongIds = coreDataResponse.exitSongIds
    yearStore.yearsRaw = coreDataResponse.years

    useRepo(Artist).insert(coreDataResponse.artists)
    useRepo(Album).insert(coreDataResponse.albums)
    useRepo(Song).insert(coreDataResponse.songs)

    // Flush avoids stale list data on the SSR-generated page.
    useRepo(List).flush()
    useRepo(List).insert(coreDataResponse.lists)

    if (rootStore.listInProgress) {
      const poll = await $api(apiEndpoints.poll.latest()).catch(() => undefined)
      if (poll && yearStore.currentYear && poll.year === yearStore.currentYear.yyyy) {
        usePollStore().currentPoll = poll
      }
    }
  })
})