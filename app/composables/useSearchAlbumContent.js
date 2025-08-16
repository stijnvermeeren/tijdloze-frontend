
export default function (album) {
  return `${album.title} ${useSearchArtistContent(album.artist)}`;
}
