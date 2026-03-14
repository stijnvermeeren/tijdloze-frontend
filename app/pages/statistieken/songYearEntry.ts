import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

export type SongYearEntry = {
  song: Song
  year: Year
}
