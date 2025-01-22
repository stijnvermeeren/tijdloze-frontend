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

  async function reloadCoreData() {
    const coreDataResponse = await nuxtApp.$api('core-data')
    rootStore.updateCoreData(coreDataResponse)

    useRepo(Artist).save(coreDataResponse.artists);
    useRepo(Album).save(coreDataResponse.albums);
    useRepo(Song).save(coreDataResponse.songs);
    useRepo(List).save(coreDataResponse.lists);
  }

  new Sockette(nuxtApp.$url.websocket("ws/current-list"), {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
    },
    onmessage: async e => {
      const response = JSON.parse(e.data)

      if (response.currentYear) {
        rootStore.setCurrentYear(response.currentYear)

        if (!useRepo(List).query().find(response.currentYear)) {
          useRepo(List).save({
            year: response.currentYear,
            songIds: []
          })
        }
      }

      if (response.exitSongIds) {
        rootStore.setExitSongIds(response.exitSongIds)
      }

      if (response.year && response.position) {
        const yearShort = response.year % 100

        if (response.songId) {
          const song = useRepo(Song).find(response.songId)
          if (song) {
            song.positions[yearShort] = response.position
            useRepo(Song).save(song)
          }

          const list = useRepo(List).find(response.year)
          list.songIds[response.position - 1] = response.songId
          useRepo(List).save(list)

          if (list.songIds.length > response.position && !list.songIds[response.position]) {
            await reloadCoreData()
          }
        } else {
          const list = useRepo(List).find(response.year)
          const songId = list.songIds[response.position - 1]
          list.songIds[response.position - 1] = null
          useRepo(List).save(list)

          if (songId) {
            const song = useRepo(Song).find(songId)
            if (song?.positions[yearShort] === response.position) {
              delete song.positions[yearShort]
              useRepo(Song).save(song)
            }
          }
        }
      }

      if (response.artist) {
        useRepo(Artist).save(response.artist)
      }

      if (response.deletedArtistId) {
        const artist = useRepo(Artist).withAll().find(response.deletedArtistId)
        if (artist) {
          useRepo(Song).destroy(artist.songs.map(song => song.id))
          useRepo(Album).destroy(artist.albums.map(album => album.id))
          useRepo(Artist).destroy(response.deletedArtistId)
        }
      }

      if (response.album) {
        useRepo(Album).save(response.album)
      }

      if (response.deletedAlbumId) {
        const album = useRepo(Album).withAll().find(response.deletedAlbumId)
        if (album) {
          useRepo(Song).destroy(album.songs.map(song => song.id))
          useRepo(Album).destroy(response.deletedAlbumId)
        }
      }

      if (response.song) {
        response.song.secondArtistId = response.song.secondArtistId || undefined
        useRepo(Song).save(response.song)
      }

      if (response.deletedSongId) {
        useRepo(Song).destroy(response.deletedSongId)
      }

      if (response.poll) {
        pollStore.currentPoll = response.poll
      }
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
})
