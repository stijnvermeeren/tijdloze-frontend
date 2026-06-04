
import type Album from '~/orm/Album'

export default function (album: Album) {
  return `${album.title} ${useSearchArtistContent(album.artist)}`;
}
