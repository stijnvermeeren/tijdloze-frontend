import _ from "lodash";

export const useSearchFilter = (queryFragments, data, matchAttribute) => {
  return data.filter(item => {
    return _.every(
      queryFragments,
      fragment => !fragment || useSearchNormalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  })
}
