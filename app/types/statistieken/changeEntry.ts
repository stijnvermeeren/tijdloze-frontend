import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

export type ChangeEntry = SongYearEntry & {
  oldPosition: number
  newPosition: number
}
