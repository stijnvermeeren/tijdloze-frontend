import Sockette from "sockette"
import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import _ from 'lodash'
import {useRootStore} from "~/stores/root";
import {usePollStore} from "~/stores/poll";
import {useRepo} from "pinia-orm";
import ListEntry from "~/orm/ListEntry";

export default defineNuxtPlugin( nuxtApp => {
  const rootStore = useRootStore()
  const pollStore = usePollStore()

  new Sockette(nuxtApp.$url.websocket("ws/current-list"), {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
    },
    onmessage: e => {
      const response = JSON.parse(e.data)

      if (response.currentYear) {
        rootStore.setCurrentYear(response.currentYear)

        if (!useRepo(List).query().find(response.currentYear)) {
          useRepo(List).save({
            year: response.currentYear,
            entryIds: []
          })
        }
      }

      if (response.exitSongIds) {
        rootStore.setExitSongIds(response.exitSongIds)
      }

      if (response.year && response.position) {
        const yearShort = response.year % 100

        if (response.songId) {
          const positions = useRepo(Song).find(response.songId)?.positions ?? {}
          positions[yearShort] = response.position
          useRepo(Song).where('id', response.songId).update({
            positions
          })

          const newEntryId = `${response.year}-${response.position}`
          useRepo(ListEntry).save({
            yearPosition: newEntryId,
            position: response.position,
            songId: response.songId
          })

          function partitionFn(entryId) {
            const entry = useRepo(ListEntry).find(entryId)
            if (entry) {
              return entry.position < response.position
            } else {
              console.log(`Failed to find entry with id ${entryId}.`)
              return false
            }
          }

          const list = useRepo(List).find(response.year)
          const partition = _.partition(
            list.entryIds.filter(entryId => entryId !== newEntryId),
            partitionFn
          )
          list.entryIds = [
            ...partition[0],
            newEntryId,
            ...partition[1]
          ];

          useRepo(List).save(list)
        } else {
          const list = useRepo(List).find(response.year)
          list.entryIds = list.entryIds.filter(entryId => {
            return useRepo(ListEntry).find(entryId).position !== response.position
          })
          useRepo(List).save(list)

          const songs = useRepo(Song).where(song => {
            return song.positions[yearShort] === response.position
          }).get()
          songs.forEach(song => {
            delete song.positions[yearShort]
            useRepo(Song).save(song)
          })
        }
      }

      if (response.artist) {
        useRepo(Artist).save(response.artist)
      }

      if (response.deletedArtistId) {
        useRepo(Song).where(song => song.artistId === response.deletedArtistId).delete()

        useRepo(Album).where(album => album.artistId === response.deletedArtistId).delete()

        useRepo(Artist).destroy(response.deletedArtistId)
      }

      if (response.album) {
        useRepo(Album).save(response.album)
      }

      if (response.deletedAlbumId) {
        useRepo(Song).where(song => song.albumId === response.deletedAlbumId).delete()

        useRepo(Album).destroy(response.deletedAlbumId)
      }

      if (response.song) {
        response.song.secondArtistId = response.song.secondArtistId || undefined
        useRepo(Song).save(response.song)
      }

      if (response.deletedSongId) {
        useRepo(Song).destroy(response.deletedSongId)
      }

      if (response.poll) {
        pollStore.setCurrentPoll(response.poll)
      }
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
})
