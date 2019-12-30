
import _ from 'lodash'

export function createSlug(text) {
  return text
    .normalize("NFD")
    .replace(/[^a-zA-Z0-9 ]/g, "")
    .replace(/ /g, '-')
    .toLowerCase()
}

export function idFromSlug(slug) {
  return _.takeWhile(slug, char => char >= '0' && char <= '9').join("")
}
