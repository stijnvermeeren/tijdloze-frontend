
export default class Song {
  constructor(songData, releaseYear, years) {
    this.title = songData.title;
    this.artistId = songData.artistId;
    this.albumId = songData.albumId;
    this.positions = songData.positions;
    this.exitCurrent = songData.exitCurrent;
    this.releaseYear = releaseYear;

    this.years = years;
  }

  position(year) {
    const position = this.positions[year.yy];
    return position > 0 ? position : null;
  }

  notInList(year) {
    if (year.isCurrent() && year.previous() && this.position(year.previous())) {
      return this.exitCurrent || !this.position(year);
    } else {
      return !this.position(year);
    }
  }

  possiblyInList(year) {
    return !this.notInList(year);
  }

  listCount() {
    return this.years.filter(year => this.position(year)).length;
  }
}
