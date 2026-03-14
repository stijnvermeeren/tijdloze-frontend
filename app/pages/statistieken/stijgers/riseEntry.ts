import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

export type RiseEntry = { song: Song; year: Year; oldPosition: number; newPosition: number }
