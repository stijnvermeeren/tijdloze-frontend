import { sortWith, ascend, takeWhile } from 'ramda'

interface RankingEntry<T> {
  position: number | '='
  entry: T
}

type RankFn<T> = (entry: T) => number | string

/* rankBy is always a single function, secondaryRankBy can be an array of functions */
export default function ranking<T extends object>(
  data: T[],
  rankBy: RankFn<T>,
  secondaryRankBy: RankFn<T> | RankFn<T>[],
  limit?: number
): RankingEntry<T>[] {
  const results: RankingEntry<T>[] = [];
  let lastEntry: T | undefined;

  sortWith(
    ([rankBy, secondaryRankBy] as RankFn<T>[]).flat().map(fn => ascend(fn))
  )(data).forEach((entry, index) => {
    if (lastEntry && rankBy(entry) === rankBy(lastEntry)) {
      results.push({
        position: '=' as const,
        entry
      })
    } else {
      const position = index + 1;
      results.push({
        position,
        entry
      });
      lastEntry = entry;
    }
  });

  return takeWhile(
    result => result.position === '=' || !limit || result.position <= limit,
    results
  );
}
