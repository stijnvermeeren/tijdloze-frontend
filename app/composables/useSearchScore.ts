
export default function (query: string, match: string) {
  query = useSearchNormalize(query);
  match = useSearchNormalize(match);
  if (query === match) {
    return 3;
  } else if (match.startsWith(query)) {
    return 2;
  } else {
    return 1;
  }
}
