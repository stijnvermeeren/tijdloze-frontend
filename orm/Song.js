import _ from 'lodash';
import { createSlug } from '~/utils/slug'
import { Model } from 'pinia-orm'
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
      aliases: this.attr(null),
      artistId: this.attr(null),
      secondArtistId: this.attr(null),
      albumId: this.attr(null),
      languageId: this.attr(null),
      leadVocals: this.attr(null),
      positions: this.attr({}),

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
      return position > 0 ? position : undefined;
    } else {
      return position > 0 && position <= 100 ? position : undefined;
    }
  }

  markedAsExit() {
    return this.$store().state.exitSongIds.includes(this.id)
  }

  notInList(year, extended) {
    return !this.probablyInList(year, extended);
  }

  /**
   * When we can assume (barring re-entries) that a song is in the list of the given year, if either
   * - The song already has a position on the list
   * - The year is current and the song was listed in the previous year and either
   *   - we're looking at the extended list and the current list is not complete
   *   - we're looking at the top 100 and the song is not yet marked as an exit and does not have a position > 100
   */
  probablyInList(year, extended) {
    if (this.position(year, extended)) {
      return true;
    }

    if (year.isCurrent() && year.previous() && this.position(year.previous(), extended)) {
      if (extended) {
        return this.$store().getters.listInProgress;
      } else {
        return !(this.markedAsExit() || this.position(year, true) > 100)
      }
    }

    return false;
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
