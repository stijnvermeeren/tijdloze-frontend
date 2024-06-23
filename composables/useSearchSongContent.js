
export const useSearchSongContent = (song) => {
  let matchData = `${song.title} ${useSearchArtistContent(song.artist)}`;
  if (song.aliases) {
    matchData += ` ${song.aliases}`
  }
  if (song.secondArtist) {
    matchData += ` ${useSearchArtistContent(song.secondArtist)}`
  }
  return matchData;
}
