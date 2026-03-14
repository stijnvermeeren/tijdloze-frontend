import type Song from '~/orm/Song'
import type Year from '~/orm/Year'

export type ReentryEntry = { song: Song; year: Year; absenceYears: number }
