import {normalize} from "~/utils/string";

export const useSearchQueryFragments = (query) => {
  console.log(query)
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
    .map(normalize)
    .filter(fragment => !ignoredWords.has(fragment));

  if (tokens.length > 1 && ignoredWordsAtEnd.has(tokens.at(-1))) {
    tokens = tokens.slice(0, -1);
  }
  if (tokens.length > 1 && ignoredWordsAtBeginning.has(tokens.at(0))) {
    tokens = tokens.slice(1);
  }
  return tokens;
}
