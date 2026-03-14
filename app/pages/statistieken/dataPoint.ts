import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

export type DataPoint = {
  song: Song
  year: Year
}
