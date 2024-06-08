import _ from "lodash";
import {normalize} from "~/utils/string";

export const useSearchArtistContent = (artist) => {
  let matchData = artist.name;
  if (artist.aliases) {
    matchData += ` ${artist.aliases}`
  }
  return matchData
}
