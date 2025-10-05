import { sortWith, ascend, takeWhile } from 'ramda'

/* rankBy is always a single function, secondaryRankBy can be an array of functions */
export default function ranking(data, rankBy, secondaryRankBy, limit) {
  const results = [];
  let lastEntry;
  let lastPosition;

  sortWith(
    [rankBy, secondaryRankBy].flat().map(fn => ascend(fn))
  )(data).forEach((entry, index) => {
    if (lastEntry && rankBy(entry) === rankBy(lastEntry)) {
      results.push({
        position: '=',
        key: entry.key,
        entry
      })
    } else {
      const position = index + 1;
      results.push({
        position,
        key: entry.key,
        entry
      });
      lastEntry = entry;
      lastPosition = position;
    }
  });

  return takeWhile(
    ({position}) => !limit || position <= limit || position === '='
  )(results);
}
