
import type Artist from '~/orm/Artist'

export default function (artist: Artist) {
  let matchData = artist.name;
  if (artist.aliases) {
    matchData += ` ${artist.aliases}`
  }
  return matchData
}
