import _ from 'lodash';

export default class Song {
  constructor(songData, releaseYear, years) {
    this.id = songData.id;
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
      return this.exitCurrent;
    } else {
      return !this.position(year);
    }
  }

  possiblyInList(year) {
    return !this.notInList(year);
  }

  possiblyInListIntervals() {
    const intervals = [];
    let unprocessedYears = this.years;

    while (unprocessedYears.length) {
      unprocessedYears = _.dropWhile(unprocessedYears, year => this.notInList(year));

      const interval = _.takeWhile(unprocessedYears, year => this.possiblyInList(year));
      if (interval.length) {
        intervals.push(interval);
        unprocessedYears = _.dropWhile(unprocessedYears, year => this.possiblyInList(year));
      }
    }

    return intervals;
  }

  stationaryIntervals() {
    const intervals = [];
    let unprocessedYears = this.years;

    while (unprocessedYears.length) {
      const position = this.position(_.first(unprocessedYears));

      if (position) {
        const interval = _.takeWhile(unprocessedYears, year => this.position(year) === position);

        if (interval.length > 1) {
          intervals.push(interval);
        }
      }

      unprocessedYears = _.dropWhile(unprocessedYears, year => this.position(year) === position);
    }

    return intervals;
  }

  listCount() {
    return this.years.filter(year => this.position(year)).length;
  }
}
