import Sockette from "sockette"
import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import _ from 'lodash'
import {useRootStore} from "~/stores/root";
import {usePollStore} from "~/stores/poll";
import {useRepo} from "pinia-orm";

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
            songIds: [],
            top100SongIds: []
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

          function partitionFn(songId) {
            const song = useRepo(Song).find(songId)
            if (song) {
              return song.positions[yearShort] < response.position
            } else {
              console.log(`Failed to find song with id ${songId}.`)
              return false
            }
          }

          const list = useRepo(List).find(response.year)
          const partition = _.partition(
            list.songIds.filter(songId => songId !== response.songId),
            partitionFn
          )
          list.songIds = [
            ...partition[0],
            response.songId,
            ...partition[1]
          ];

          if (response.position <= 100) {
            const partition = _.partition(
              list.top100SongIds.filter(songId => songId !== response.songId),
              partitionFn
            )
            list.top100SongIds = [
              ...partition[0],
              response.songId,
              ...partition[1]
            ];
          }
          useRepo(List).save(list)
        } else {
          const list = useRepo(List).find(response.year)
          list.songIds = list.songIds.filter(songId => {
            return useRepo(Song).find(songId).positions[yearShort] !== response.position
          })
          if (response.position <= 100) {
            list.top100SongIds = list.top100SongIds.filter(songId => {
              return useRepo(Song).find(songId).positions[yearShort] !== response.position
            })
          }
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
