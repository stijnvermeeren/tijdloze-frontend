import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

function createIntervals(years: Year[], fn: (year: Year) => unknown): Year[][] {
  const intervals: Year[][] = [];
  let currentInterval: Year[] = [];

  for (const year of years) {
    if (fn(year)) {
      currentInterval.push(year);
    } else if (currentInterval.length) {
      intervals.push(currentInterval);
      currentInterval = [];
    }
  }

  if (currentInterval.length) {
    intervals.push(currentInterval);
  }

  return intervals;
}


export function allEntriesIntervals(songs: Song[], years: Year[], extended?: boolean): Year[][] {
  function showYear(year: Year): boolean {
    const currentYear = useYearStore().currentYear
    return (!!currentYear && year.equals(currentYear)) || !!songs.find(song => song.position(year, extended));
  }

  return createIntervals(years, showYear)
}

export function probablyInListIntervals(songs: Song[], years: Year[], extended?: boolean): Year[][] {
  function probablyInList(year: Year): boolean {
    return !!songs.find(song => song.probablyInList(year, extended));
  }

  return createIntervals(years, probablyInList)
}
