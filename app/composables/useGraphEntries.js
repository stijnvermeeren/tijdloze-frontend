export default function (songs) {
  const top100Songs = []
  const fullListSongs = []
  const { years } = storeToRefs(useYearStore())
  songs.forEach(song => {
    if (song.listCount(years.value) > 0) {
      top100Songs.push(song)
    } else {
      fullListSongs.push(song)
    }
  })

  const entries = []
  top100Songs.forEach(song => {
    entries.push({song, isTop100: true})
  })
  fullListSongs.forEach(song => {
    entries.push({song, isTop100: false})
  })
  return entries
}
