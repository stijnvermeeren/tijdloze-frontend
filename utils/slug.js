
import _ from 'lodash'

export function createSlug(text) {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ /g, '-')
}

export function idFromSlug(slug) {
  return _.takeWhile(slug, char => char >= '0' && char <= '9').join("")
}
