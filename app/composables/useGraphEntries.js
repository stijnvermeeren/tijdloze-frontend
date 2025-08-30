export default function (songs) {
  const { years } = storeToRefs(useYearStore())
  return computed(() => {
    const top = []
    const rest = []
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
