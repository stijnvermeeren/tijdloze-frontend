import _ from 'lodash';
import { Model } from '@vuex-orm/core'
import Artist from "./Artist";
import Album from "./Album";

export default class Song extends Model {
  static get entity() {
    return 'songs';
  }

  static fields() {
    return {
      id: this.attr(null),
      title: this.attr(null),
      artistId: this.attr(null),
      albumId: this.attr(null),
      languageId: this.attr(null),
      leadVocals: this.attr(null),
      positions: this.attr(null),
      exitCurrent: this.attr(null),

      artist: this.belongsTo(Artist, 'artistId'),
      album: this.belongsTo(Album, 'albumId')
    };
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

  possiblyInListIntervals(years) {
    const intervals = [];
    let unprocessedYears = years;

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

  stationaryIntervals(years) {
    const intervals = [];
    let unprocessedYears = years;

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

  listCount(years) {
    return years.filter(year => this.position(year)).length;
  }

  isReEntry(years, year) {
    return this.position(year) &&
      year.previous() &&
      !this.position(year.previous()) &&
      !years.find(year => this.position(year)).equals(year);
  }
}
