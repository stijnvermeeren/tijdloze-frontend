import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

export type ReentryEntry = SongYearEntry & { absenceYears: number }
