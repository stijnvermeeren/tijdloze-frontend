
export default function (query: string) {
  if (!query) {
    return []
  }

  const ignoredWords = new Set(["feat", "ft", "and", "en"]);
  // Don't always ignore "live", otherwise we can't find the band "Live"
  const ignoredWordsAtEnd = new Set(["live", "unplugged"]);
  // Don't always ignore "the", otherwise we can't find the band "The The"
  const ignoredWordsAtBeginning = new Set(["the"]);

  let tokens = query
    .split(/[ .,&\-\/']+/)
    .map(useSearchNormalize)
    .filter((fragment: string) => !ignoredWords.has(fragment));

  const lastToken = tokens[tokens.length - 1]
  if (lastToken && ignoredWordsAtEnd.has(lastToken)) {
    tokens = tokens.slice(0, -1);
  }
  const firstToken = tokens[0]
  if (firstToken && ignoredWordsAtBeginning.has(firstToken)) {
    tokens = tokens.slice(1);
  }
  return tokens;
}
