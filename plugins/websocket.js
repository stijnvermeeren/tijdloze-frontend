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

      store.commit('setCurrentYear', response.year)
      store.commit('setExitSongIds', response.exitSongIds)

      Artist.insertOrUpdate({
        data: response.newArtists
      })
      Album.insertOrUpdate({
        data: response.newAlbums
      })
      Song.insertOrUpdate({
        data: response.newSongs.filter(song => {
          const existingSong = store.getters['entities/songs']().withAll().find(song.id);
          return !existingSong;
        })
      })

      const yearShort = response.year % 100
      const responseEntries = _.keyBy(response.entries, entry => entry.songId)

      Song.update({
        where: song => {
          const entry = responseEntries[song.id]
          return entry && entry.position !== song.positions[yearShort]
        },
        data: song => {
          const entry = responseEntries[song.id]
          song.positions[yearShort] = entry.position
        }
      })

      Song.update({
        where: song => {
          const inList = song.positions[yearShort] <= 100
          const shouldNotBeInList = !(song.id in responseEntries)
          return inList && shouldNotBeInList
        },
        data: song => {
          delete song.positions[yearShort]
        }
      })
    },
    onreconnect: e => {},
    onmaximum: e => {},
    onclose: e => {},
    onerror: e => {}
  });
}
