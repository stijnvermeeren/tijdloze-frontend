import Sockette from "sockette"
import Song from '~/orm/Song'
import Artist from '~/orm/Artist'
import List from "~/orm/List";
import Album from "~/orm/Album";
import {useRootStore} from "~/stores/root";
import {usePollStore} from "~/stores/poll";
import {useRepo} from "pinia-orm";

export default defineNuxtPlugin( nuxtApp => {
  const rootStore = useRootStore()
  const yearStore = useYearStore()
  const pollStore = usePollStore()

  async function reloadCoreData() {
    const coreDataResponse = await nuxtApp.$api('core-data')
    rootStore.exitSongIds = coreDataResponse.exitSongIds
    yearStore.yearsRaw = coreDataResponse.years

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
        yearStore.setCurrentYear(response.currentYear)

        if (!useRepo(List).query().find(response.currentYear)) {
          useRepo(List).save({
            year: response.currentYear,
            songIds: []
          })
        }
      }

      if (response.exitSongIds) {
        rootStore.exitSongIds = response.exitSongIds
      }

      if (response.year && response.position) {
        const yearShort = response.year % 100
        const list = useRepo(List).find(response.year)

        if (list) {
          if (list.songIds.length > response.position && !list.songIds[response.position]) {
            await reloadCoreData()
          } else {
            if (response.songId) {
              const song = useRepo(Song).find(response.songId)
              if (song) {
                song.positions[yearShort] = response.position
                useRepo(Song).save(song)

                list.songIds[response.position - 1] = response.songId
                useRepo(List).save(list)
              } else {
                await reloadCoreData()
              }
            } else {
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
        const artist = useRepo(Artist).find(response.album.artistId)
        if (artist) {
          useRepo(Album).save(response.album)
        } else {
          await reloadCoreData()
        }
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

        const artist = useRepo(Artist).find(response.song.artistId)
        const album = useRepo(Artist).find(response.song.albumId)
        const secondArtist = useRepo(Artist).find(response.song.secondArtistId)
 
        if (artist && (response.song.secondArtistId === undefined || secondArtist) && album) {
          useRepo(Song).save(response.song)
        } else {
          await reloadCoreData()
        }
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
