import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

export type OneHitEntry = { song: Song; year: Year; isFinal: boolean }
