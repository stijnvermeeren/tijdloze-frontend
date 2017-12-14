
export default class Song {
  constructor(songData, releaseYear, years) {
    this.title = songData.title;
    this.artistId = songData.artistId;
    this.albumId = songData.albumId;
    this.positions = songData.positions;
    this.exitCurrent = songData.exitCurrent;
    this.years = years;
    this.releaseYear = releaseYear;
  }

  position(year) {
    const position = this.positions[year.yy];
    return position > 0 ? position : null;
  }

  notInList(year) {
    if (year.equals(this.years.currentYear()) && this.years.previousYear() && this.position(this.years.previousYear())) {
      console.log(this.exitCurrent);
      console.log(this.position(year));

      return this.exitCurrent || !this.position(year);
    } else {
      return this.position(year) === 0;
    }
  }

  listCount() {
    return this.years.years.filter(year => this.position(year)).length;
  }
}
