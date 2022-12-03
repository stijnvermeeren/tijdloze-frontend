
import _ from 'lodash';

export default function ranking(data, rankBy, secondaryRankBy, limit) {
  const results = [];
  let lastEntry;
  let lastPosition;

  _.sortBy(data, _.concat(rankBy, secondaryRankBy)).forEach((entry, index) => {
    if (lastEntry && _.isEqual(rankBy(entry), rankBy(lastEntry))) {
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

  return _.takeWhile(
    results,
    ({position}) => !limit || position <= limit || position === '='
  );
}
