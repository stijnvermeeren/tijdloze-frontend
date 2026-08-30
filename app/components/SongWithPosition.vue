<template lang="pug">
div.entry
  div.position
    slot
      position-in-list(:song='song' :override-position="overridePosition" :year='year' :hide-previous-next="hidePreviousNext")
  song-with-cover(:song="song" :attribution="attribution" :show-entry-stats='showEntryStats' :details-sections='detailSections')
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";
import type Year from "~/orm/Year";

const props = withDefaults(defineProps<{
  song: Song
  attribution?: string
  overridePosition?: number
  year: Year
  hidePreviousNext?: boolean
  showEntryStats?: boolean
}>(), {
  showEntryStats: false
})

type PositionEntry = {
  year: Year
  position: number
}

type BestInfo = {
  position: number
  count: number
  firstYear: number
  lastYear: number
  continuous: boolean
}

const { years, currentYear } = storeToRefs(useYearStore())

const top100Entries = computed<PositionEntry[]>(() => {
  return years.value.flatMap((entryYear) => {
    const position = props.song.position(entryYear)
    return position ? [{ year: entryYear, position }] : []
  })
})

const countdownOnlyEntries = computed<PositionEntry[]>(() => {
  return years.value.flatMap((entryYear) => {
    const position = props.song.position(entryYear, true)
    return position && position > 100 ? [{ year: entryYear, position }] : []
  })
})

const hasTop100Entries = computed(() => top100Entries.value.length > 0)
const hasCountdownEntries = computed(() => countdownOnlyEntries.value.length > 0)

function isContinuousYearSpan(entryYears: number[], extended = false, endYear?: number): boolean {
  if (entryYears.length < 2 && endYear === undefined) {
    return true
  }

  const listYears = years.value.map(year => year.yyyy)
  const firstYear = entryYears[0]
  const lastYear = endYear ?? entryYears[entryYears.length - 1]
  if (firstYear === undefined || lastYear === undefined) {
    return false
  }

  const relevantYears = listYears.filter(year => year >= firstYear && year <= lastYear)
  return relevantYears.every(year => {
    if (year === currentYear.value?.yyyy && !!currentYear.value && props.song.probablyInList(currentYear.value, extended)) {
      return true
    }
    return entryYears.includes(year)
  })
}

function yearRange(entries: PositionEntry[], extended = false): { firstYear?: number, lastYear?: number, continuous: boolean } | undefined {
  if (!entries.length) {
    return undefined
  }

  const first = entries[0]
  if (!first) {
    return undefined
  }

  const entryYears = entries.map(entry => entry.year.yyyy)
  const maybeInCurrentTop100 = !!currentYear.value && props.song.probablyInList(currentYear.value)
  const possiblyInCurrentYear = !!currentYear.value
    && props.song.probablyInList(currentYear.value, extended)
    && (!extended || !maybeInCurrentTop100)

  if (possiblyInCurrentYear) {
    return {
      firstYear: first.year.yyyy,
      lastYear: undefined,
      continuous: isContinuousYearSpan(entryYears, extended, currentYear.value?.yyyy)
    }
  }

  const last = entries[entries.length - 1]
  if (!last) {
    return undefined
  }

  return {
    firstYear: first.year.yyyy,
    lastYear: last.year.yyyy,
    continuous: isContinuousYearSpan(entryYears, extended)
  }
}

function bestEntry(entries: PositionEntry[]): PositionEntry | undefined {
  return entries.reduce<PositionEntry | undefined>((best, entry) => {
    if (!best || entry.position < best.position) {
      return entry
    }
    return best
  }, undefined)
}

function bestInfo(entries: PositionEntry[], includeBest: boolean): BestInfo | undefined {
  if (!includeBest) {
    return undefined
  }

  const best = bestEntry(entries)
  if (!best) {
    return undefined
  }

  const yearsWithBest = entries.filter(entry => entry.position === best.position).map(entry => entry.year.yyyy)
  const firstYear = yearsWithBest[0]
  const lastYear = yearsWithBest[yearsWithBest.length - 1]

  if (!firstYear || !lastYear) {
    return undefined
  }

  return {
    position: best.position,
    count: yearsWithBest.length,
    firstYear,
    lastYear,
    continuous: isContinuousYearSpan(yearsWithBest)
  }
}

const top100BestInfo = computed(() => bestInfo(top100Entries.value, true))
const countdownBestInfo = computed(() => bestInfo(countdownOnlyEntries.value, !hasTop100Entries.value))
const top100Years = computed(() => yearRange(top100Entries.value, false))
const countdownYears = computed(() => yearRange(countdownOnlyEntries.value, true))

const detailSections = computed(() => {
  const sections = [] as Array<{
    label: string
    count: number
    firstYear?: number
    lastYear?: number
    continuous?: boolean
    bestInfo?: BestInfo
  }>

  if (hasTop100Entries.value) {
    sections.push({ label: 'top 100', count: top100Entries.value.length, ...top100Years.value, bestInfo: top100BestInfo.value })
  }
  if (hasCountdownEntries.value) {
    sections.push({ label: 'countdown', count: countdownOnlyEntries.value.length, ...countdownYears.value, bestInfo: countdownBestInfo.value })
  }

  return sections
})
</script>

<style scoped>
  div.entry {
    display: flex;
    min-height: 64px;
    align-items: center;

    .position {
      width: 80px;
      text-align: center;
    }
  }
</style>
