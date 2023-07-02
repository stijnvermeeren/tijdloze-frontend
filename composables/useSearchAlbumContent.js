import _ from "lodash";
import {normalize} from "~/utils/string";
import {useSearchArtistContent} from "~/composables/useSearchArtistContent";

export const useSearchAlbumContent = (album) => {
  return `${album.title} ${useSearchArtistContent(album.artist)}`;
}
