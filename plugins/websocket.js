import Sockette from "sockette"
import Artist from '~/orm/Artist'
import Album from '~/orm/Album'
import Song from '~/orm/Song'
import List from '~/orm/List'
import _ from 'lodash'

export default function ({ app, store }) {
  new Sockette(app.$url.websocket("ws/current-list"), {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
    },
    onmessage: e => {
      const response = JSON.parse(e.data)

      if (response.currentYear) {
        store.commit('setCurrentYear', response.currentYear)

        if (!List.query().find(response.currentYear)) {
          List.insert({
            data: {
              year: response.currentYear,
              songIds: [],
              top100SongIds: []
            }
          })
        }
      }

      if (response.exitSongIds) {
        store.commit('setExitSongIds', response.exitSongIds)
      }

      if (response.year && response.position) {
        const yearShort = response.year % 100

        if (response.songId) {
          Song.update({
            where: response.songId,
            data: song => {
              song.positions[yearShort] = response.position
            }
          })

          List.update({
            where: response.year,
            data: list => {
              const partition = _.partition(
                list.songIds.filter(songId => songId !== response.songId),
                songId => Song.find(songId).positions[yearShort] < response.position
              )
              list.songIds = [
                ...partition[0],
                response.songId,
                ...partition[1]
              ];

              if (response.position <= 100) {
                const partition = _.partition(
                  list.top100SongIds.filter(songId => songId !== response.songId),
                  songId => Song.find(songId).positions[yearShort] < response.position
                )
                list.songIds = [
                  ...partition[0],
                  response.songId,
                  ...partition[1]
                ];
              }
            }
          })
        } else {
          List.update({
            where: response.year,
            data: list => {
              list.songIds = list.songIds.filter(songId => {
                return Song.find(songId).positions[yearShort] !== response.position
              })
              if (response.position <= 100) {
                list.top100SongIds = list.top100SongIds.filter(songId => {
                  return Song.find(songId).positions[yearShort] !== response.position
                })
              }
            }
          })

          Song.update({
            where: song => {
              return song.positions[yearShort] === response.position
            },
            data: song => {
              delete song.positions[yearShort]
            }
          })
        }
      }

      if (response.artist) {
        Artist.insertOrUpdate({
          data: response.artist
        })
        store.commit('artistsForLinks', Artist.all())
      }

      if (response.deletedArtistId) {
        Song.delete(song => song.artistId === response.deletedArtistId)
        store.commit('songsForLinks', Song.all())

        Album.delete(album => album.artistId === response.deletedArtistId)

        Artist.delete(response.deletedArtistId)
        store.commit('artistsForLinks', Artist.all())
      }

      if (response.album) {
        Album.insertOrUpdate({
          data: response.album
        })
      }

      if (response.deletedAlbumId) {
        Song.delete(song => song.albumId === response.deletedAlbumId)
        store.commit('songsForLinks', Song.all())

        Album.delete(response.deletedAlbumId)
      }

      if (response.song) {
        Song.insertOrUpdate({
          data: response.song
        })
        store.commit('songsForLinks', Song.all())
      }

      if (response.deletedSongId) {
        Song.delete(response.deletedSongId)
        store.commit('songsForLinks', Song.all())
      }

      if (response.poll) {
        store.commit('poll/setCurrentPoll', response.poll)
      }
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
}
