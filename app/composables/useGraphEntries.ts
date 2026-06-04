import type Song from '~/orm/Song'

type GraphEntry = {
  song: Song
  isTop100: boolean
}

export default function (songs: Song[]) {
  const { years } = storeToRefs(useYearStore())
  return computed<GraphEntry[]>(() => {
    const top: GraphEntry[] = []
    const rest: GraphEntry[] = []
    for (const song of songs) {
      if (song?.listCount?.(years.value) > 0) {
        top.push({ song, isTop100: true })
      } else {
        rest.push({ song, isTop100: false })
      }
    }
    return top.concat(rest)
  })
}
