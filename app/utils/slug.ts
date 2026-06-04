
import { takeWhile } from 'ramda'

export function createSlug(text: string): string {
  return text
    .toLowerCase()
    .normalize("NFD")
    .replace(/æ/g, "ae")
    .replace(/[^a-z0-9 ]/g, "")
    .replace(/ /g, '-')
}

export function idFromSlug(slug: string): string {
  return takeWhile((char: string) => char >= '0' && char <= '9')(slug.split('')).join('')
}
