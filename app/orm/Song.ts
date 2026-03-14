import { createSlug } from '~/utils/slug'
import { Model } from 'pinia-orm'
import type { ModelFields } from 'pinia-orm'
import { splitWhen } from 'ramda'
import Artist from './Artist'
import Album from './Album'
import type Year from './Year'
import { useRootStore } from '~/stores/root'
import { useYearStore } from '~/stores/year'

export default class Song extends Model {
  declare id: number
  declare title: string
  declare aliases?: string
  declare artistId: number
  declare secondArtistId?: number
  declare albumId: number
  declare languageId?: string
  declare leadVocals?: string
  declare positions: Record<string, number>

  declare artist: Artist
  declare secondArtist?: Artist
  declare album: Album

  static override get entity(): string {
    return 'songs'
  }

  static override fields(): ModelFields {
    return {
      id: this.attr(undefined),
      title: this.attr(undefined),
      aliases: this.attr(undefined),
      artistId: this.attr(undefined),
      secondArtistId: this.attr(undefined),
      albumId: this.attr(undefined),
      languageId: this.attr(undefined),
      leadVocals: this.attr(undefined),
      positions: this.attr({}),

      artist: this.belongsTo(Artist, 'artistId'),
      secondArtist: this.belongsTo(Artist, 'secondArtistId'),
      album: this.belongsTo(Album, 'albumId')
    }
  }

  get slug(): string {
    return createSlug(this.title)
  }

  position(year: Year, extended = false): number | undefined {
    const position = this.positions[year.yy] ?? 0
    if (extended) {
      return position > 0 ? position : undefined
    } else {
      return position > 0 && position <= 100 ? position : undefined
    }
  }

  markedAsExit(): boolean {
    return useRootStore().exitSongIds.includes(this.id)
  }

  notInList(year: Year, extended = false): boolean {
    return !this.probablyInList(year, extended)
  }

  /**
   * When we can assume (barring re-entries) that a song is in the list of the given year, if either
   * - The song already has a position on the list
   * - The year is current and the song was listed in the previous year and either
   *   - we're looking at the extended list and the current list is not complete
   *   - we're looking at the top 100 and the song is not yet marked as an exit and does not have a position > 100
   */
  probablyInList(year: Year, extended = false): boolean {
    if (this.position(year, extended)) {
      return true
    }

    const previousYear = useYearStore().context.forYear(year).previous?.year
    const currentYear = useYearStore().currentYear

    if (currentYear && year.equals(currentYear) && previousYear && this.position(previousYear, extended)) {
      if (extended) {
        return useRootStore().listInProgress
      } else {
        return !(this.markedAsExit() || (this.position(year, true) ?? 0) > 100)
      }
    }

    return false;
  }

  stationaryIntervals(years: Year[]): Year[][] {
    const intervals: Year[][] = []
    let unprocessedYears = years

    while (unprocessedYears.length) {
      const firstYear = unprocessedYears[0]!
      const position = this.position(firstYear)

      const [interval, rest] = splitWhen((year: Year) => this.position(year) !== position, unprocessedYears)
      if (position && interval.length > 1) {
        intervals.push(interval)
      }

      unprocessedYears = rest
    }

    return intervals
  }

  listCount(years: Year[]): number {
    return years.filter(year => this.position(year)).length
  }

  isReEntry(year: Year): boolean {
    const previousYear = useYearStore().context.forYear(year).previous?.year
    const firstYearInList = useYearStore().years.find(candidate => this.position(candidate))

    return !!this.position(year) &&
      !!previousYear &&
      !this.position(previousYear) &&
      !!firstYearInList &&
      !firstYearInList.equals(year)
  }
}
