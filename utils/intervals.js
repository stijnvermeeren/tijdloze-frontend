import _ from 'lodash'

export function possiblyInListIntervals(songs, years) {
  function noneInList(year) {
    return !songs.find(song => !song.notInList(year));
  }

  function possiblyInList(year) {
    return songs.find(song => song.possiblyInList(year));
  }

  const intervals = [];
  let unprocessedYears = years;

  while (unprocessedYears.length) {
    unprocessedYears = _.dropWhile(unprocessedYears, noneInList);

    const interval = _.takeWhile(unprocessedYears, possiblyInList);
    if (interval.length) {
      intervals.push(interval);
      unprocessedYears = _.dropWhile(unprocessedYears, possiblyInList);
    }
  }

  return intervals;
}
