
export function normalize(input) {
  return input
    .toLowerCase()
    .normalize("NFD")
    .replace(/æ/g, "ae")
    .replace(/ing\b/g, "in") // match e.g. "loving" with "lovin"
    .replace(/\bo\b/g, "of") // match "o" with "of"
    .replace(/[\u0300-\u036f]/g, "") // combining accents
    .replace(/[^a-zA-Z0-9 ]/g, "")
}
