import _ from "lodash";

export default function (queryFragments, data, matchAttribute) {
  return data.filter(item => {
    return _.every(
      queryFragments,
      fragment => !fragment || useSearchNormalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  })
}
