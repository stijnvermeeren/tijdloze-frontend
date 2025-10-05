import { dropWhile, splitWhen } from 'ramda'

function createIntervals(years, fn) {
  const intervals = [];
  let unprocessedYears = years;

  while (unprocessedYears.length) {
    unprocessedYears = dropWhile(year => !fn(year))(unprocessedYears);

    const [interval, rest] = splitWhen(year => !fn(year))(unprocessedYears);
    if (interval.length) {
      intervals.push(interval);
      unprocessedYears = rest;
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
