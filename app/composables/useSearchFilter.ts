export default function <T>(queryFragments: string[], matchAttribute: (item: T) => string) {
  return (item: T) => {
    return queryFragments.every(
      (fragment: string) => !fragment || useSearchNormalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  }
}
