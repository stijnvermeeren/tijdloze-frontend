
import takeWhile from 'ramda/src/takeWhile'

export function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ /g, '-')
}

export function idFromSlug(slug) {
  return takeWhile(char => char >= '0' && char <= '9')(slug)
}
