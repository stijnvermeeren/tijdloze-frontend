
export const useSearchAlbumContent = (album) => {
  return `${album.title} ${useSearchArtistContent(album.artist)}`;
}
