export default function (queryFragments, matchAttribute) {
  return item => {
    return queryFragments.every(
      fragment => !fragment || useSearchNormalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  }
}
