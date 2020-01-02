import Sockette from "sockette"
import Artist from '~/orm/Artist'
import Album from '~/orm/Album'
import Song from '~/orm/Song'

const config = require('~/config.json');

export default function ({ store }) {
  new Sockette(`${config.WEBSOCKET_URI}current-list/ws`, {
    timeout: 5e3,
    maxAttempts: 10,
    onopen: e => {
    },
    onmessage: e => {
      console.time('someFunction');
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

      const yearShort = response.year % 100
      const responseEntryIds = new Set(response.entries.map(entry => entry.songId))

      Song.update({
        where: song => {
          return responseEntryIds.has(song.id)
        },
        data: song => {
          const entry = response.entries.find(entry => entry.songId === song.id)
          song.positions[yearShort] = entry.position
        }
      })

      Song.update({
        where: song => {
          const inList = song.positions[yearShort] <= 100
          const shouldNotBeInList = !responseEntryIds.has(song.id)
          return inList && shouldNotBeInList
        },
        data: song => {
          delete song.positions[yearShort]
        }
      })

      console.timeEnd('someFunction');
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
}
