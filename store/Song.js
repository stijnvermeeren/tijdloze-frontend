import _ from 'lodash';
import { createSlug } from '~/utils/slug'
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
      secondArtistId: this.attr(null),
      albumId: this.attr(null),
      languageId: this.attr(null),
      leadVocals: this.attr(null),
      positions: this.attr(null),

      artist: this.belongsTo(Artist, 'artistId'),
      secondArtist: this.belongsTo(Artist, 'secondArtistId'),
      album: this.belongsTo(Album, 'albumId')
    };
  }

  get slug() {
    return createSlug(this.title)
  }

  position(year, extended) {
    const position = this.positions[year.yy];
    if (extended) {
      return position > 0 ? position : null;
    } else {
      return position > 0 && position <= 100 ? position : null;
    }
  }

  isKnownExit() {
    return this.$store().state.exitSongIds.includes(this.id)
  }

  /**
   * When we can assume (barring re-entries) that a song is not in the list of the given year, so either
   * - The year is not current and the song is not in the list
   * - The year is current and the song is known as an exit
   * - The year is current and the song was not in the previous list and is not (yet) in the current list
   */
  notInList(year, extended) {
    if (year.isCurrent() && year.previous() && this.position(year.previous(), extended)) {
      return this.isKnownExit();
    } else {
      return !this.position(year, extended);
    }
  }

  probablyInList(year, extended) {
    return !this.notInList(year, extended);
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
