import Sockette from "sockette"
import Artist from '~/orm/Artist'
import Album from '~/orm/Album'
import Song from '~/orm/Song'
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
        store.commit('setCurrentYear', response.year)
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
        } else {
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
      }

      if (response.album) {
        Album.insertOrUpdate({
          data: response.album
        })
      }

      if (response.song) {
        Song.insertOrUpdate({
          data: response.song
        })
      }
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
}
