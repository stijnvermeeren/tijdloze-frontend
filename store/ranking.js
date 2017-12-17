
import _ from 'lodash';

export default function ranking(data, rankBy, secondaryRankBy, limit) {
  const results = [];
  let lastEntry;
  let lastPosition;

  _.sortBy(data, _.concat(rankBy, secondaryRankBy)).forEach((entry, index) => {
    if (lastEntry && _.isEqual(rankBy(entry), rankBy(lastEntry))) {
      results.push({
        position: '=',
        entry
      })
    } else {
      const position = index + 1;
      results.push({
        position,
        entry
      });
      lastEntry = entry;
      lastPosition = position;
    }
  });

  return _.takeWhile(results, ({position}) => position === '=' || position <= limit);
}
