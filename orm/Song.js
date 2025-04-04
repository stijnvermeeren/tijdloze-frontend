import _ from 'lodash';
import { createSlug } from '~/utils/slug'
import { Model } from 'pinia-orm'
import Artist from "./Artist";
import Album from "./Album";
import {useRootStore} from "~/stores/root";

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
    return useRootStore().exitSongIds.includes(this.id)
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

    const previousYear = useYearStore().context.forYear(year).previous?.year

    if (year.equals(useYearStore().currentYear) && previousYear && this.position(previousYear, extended)) {
      if (extended) {
        return useRootStore().listInProgress;
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

  isReEntry(year) {
    const previousYear = useYearStore().context.forYear(year).previous?.year

    return this.position(year) &&
      previousYear &&
      !this.position(previousYear) &&
      !useYearStore().years.find(year => this.position(year)).equals(year);
  }
}
