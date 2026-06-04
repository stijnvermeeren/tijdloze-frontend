import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

export type OneHitEntry = SongYearEntry & { isFinal: boolean }
