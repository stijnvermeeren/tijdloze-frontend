import dropWhile from "ramda/src/dropWhile"
import takeWhile from "ramda/src/takeWhile"

function createIntervals(years, fn) {
  const intervals = [];
  let unprocessedYears = years;

  while (unprocessedYears.length) {
    unprocessedYears = dropWhile(year => !fn(year))(unprocessedYears);

    const interval = takeWhile(fn)(unprocessedYears);
    if (interval.length) {
      intervals.push(interval);
      unprocessedYears = dropWhile(fn)(unprocessedYears);
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
