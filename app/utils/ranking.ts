import { sortWith, ascend } from 'ramda'

interface RankingEntry<T> {
  position: number | '='
  key: unknown
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
        key: (entry as Record<string, unknown>).key,
        entry
      })
    } else {
      const position = index + 1;
      results.push({
        position,
        key: (entry as Record<string, unknown>).key,
        entry
      });
      lastEntry = entry;
    }
  });

  const limitedResults: RankingEntry<T>[] = []
  for (const result of results) {
    if (result.position === '=' || !limit || (typeof result.position === 'number' && result.position <= limit)) {
      limitedResults.push(result)
    } else {
      break
    }
  }
  return limitedResults;
}
