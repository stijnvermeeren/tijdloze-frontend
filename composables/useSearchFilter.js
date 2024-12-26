import _ from "lodash";

export default function (queryFragments, matchAttribute) {
  return item => {
    return _.every(
      queryFragments,
      fragment => !fragment || useSearchNormalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  }
}
