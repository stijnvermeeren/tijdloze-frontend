import Sockette from "sockette"
import Artist from '../store/Artist'
import Album from '../store/Album'
import Song from '../store/Song'

const config = require('~/config.json');

export default function ({ store }) {
  new Sockette(`${config.WEBSOCKET_URI}current-list/ws`, {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
    },
    onmessage: e => {
      const response = JSON.parse(e.data)

      store.commit('setCurrentYear', response.year)
      store.commit('setExitSongIds', response.exitSongIds)

      Artist.insertOrUpdate({
        data: response.newArtists
      })
      Album.insertOrUpdate({
        data: response.newAlbums
      })
      Song.insertOrUpdate({
        data: response.newSongs
      })

      Song.update({
        where: song => true,
        data: song => {
          const entry = response.entries.find(entry => entry.songId === song.id)
          if (entry) {
            song.positions[response.year % 100] = entry.position
          } else if (song.positions[response.year % 100] <= 100) {
            delete song.positions[response.year % 100]
          }
        }
      })
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
}
