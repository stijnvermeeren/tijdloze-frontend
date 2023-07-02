import _ from "lodash";
import {normalize} from "~/utils/string";

export const useSearchFilter = (queryFragments, data, matchAttribute) => {
  return data.filter(item => {
    return _.every(
      queryFragments,
      fragment => !fragment || normalize(matchAttribute(item)).indexOf(fragment) > -1
    )
  })
}
