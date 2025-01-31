import _ from 'lodash'

function createIntervals(years, fn) {
  const intervals = [];
  let unprocessedYears = years;

  while (unprocessedYears.length) {
    unprocessedYears = _.dropWhile(unprocessedYears, year => !fn(year));

    const interval = _.takeWhile(unprocessedYears, fn);
    if (interval.length) {
      intervals.push(interval);
      unprocessedYears = _.dropWhile(unprocessedYears, fn);
    }
  }

  return intervals;
}


export function allEntriesIntervals(songs, years, extended) {
  function showYear(year) {
    return year.equals(useYearStore().currentYear) || songs.find(song => song.position(year, extended));
  }

  return createIntervals(years, showYear)
}

export function probablyInListIntervals(songs, years, extended) {
  function probablyInList(year) {
    return songs.find(song => song.probablyInList(year, extended));
  }

  return createIntervals(years, probablyInList)
}
