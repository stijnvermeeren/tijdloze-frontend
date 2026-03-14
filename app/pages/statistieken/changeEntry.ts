import type { SongYearEntry } from '~/pages/statistieken/songYearEntry'

export type ChangeEntry = SongYearEntry & {
  oldPosition: number
  newPosition: number
}
