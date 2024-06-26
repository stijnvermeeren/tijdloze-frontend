
export default function (input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/æ/g, "ae")
    .replace(/ing\b/g, "in") // match e.g. "loving" with "lovin"
    .replace(/\bo\b/g, "of") // match "o" with "of"
    .replace(/\b2\b/g, "to") // match "2" with "to"
    .replace(/\bu\b/g, "you") // match "u" with "you"
    .replace(/[\u0300-\u036f]/g, "") // combining accents
    .replace(/[^a-zA-Z0-9 ]/g, "")
}
