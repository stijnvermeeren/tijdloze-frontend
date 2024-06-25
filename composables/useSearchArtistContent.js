
export default function (artist) {
  let matchData = artist.name;
  if (artist.aliases) {
    matchData += ` ${artist.aliases}`
  }
  return matchData
}
