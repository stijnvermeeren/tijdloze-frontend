import _ from 'lodash'

export function probablyInListIntervals(songs, years, extended) {
  function noneInList(year) {
    return !songs.find(song => !song.notInList(year, extended));
  }

  function probablyInList(year) {
    return songs.find(song => song.probablyInList(year, extended));
  }

  const intervals = [];
  let unprocessedYears = years;

  while (unprocessedYears.length) {
    unprocessedYears = _.dropWhile(unprocessedYears, noneInList);

    const interval = _.takeWhile(unprocessedYears, probablyInList);
    if (interval.length) {
      intervals.push(interval);
      unprocessedYears = _.dropWhile(unprocessedYears, probablyInList);
    }
  }

  return intervals;
}
