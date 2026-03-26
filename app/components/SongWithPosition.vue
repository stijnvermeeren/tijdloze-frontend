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
}

const { years, currentYear } = storeToRefs(useYearStore())

const top100Entries = computed<PositionEntry[]>(() => {
  return years.value.flatMap((entryYear) => {
    const position = props.song.position(entryYear)
    return position ? [{ year: entryYear, position }] : []
  })
})

const countdownEntries = computed<PositionEntry[]>(() => {
  return years.value.flatMap((entryYear) => {
    const position = props.song.position(entryYear, true)
    return position ? [{ year: entryYear, position }] : []
  })
})

const countdownOnlyEntries = computed<PositionEntry[]>(() => {
  return countdownEntries.value.filter(entry => entry.position > 100)
})

const hasTop100Entries = computed(() => top100Entries.value.length > 0)
const hasCountdownEntries = computed(() => countdownOnlyEntries.value.length > 0)

const isPossiblyInCurrentYear = computed(() => {
  return !!currentYear.value && props.song.probablyInList(currentYear.value, true)
})

function bestEntry(entries: PositionEntry[]): PositionEntry | undefined {
  return entries.reduce<PositionEntry | undefined>((best, entry) => {
    if (!best || entry.position < best.position) {
      return entry
    }
    return best
  }, undefined)
}

function lastEntry(entries: PositionEntry[]): PositionEntry | undefined {
  return entries[entries.length - 1]
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
    lastYear
  }
}

function lastText(entries: PositionEntry[]): string | undefined {
  const last = lastEntry(entries)
  if (!isPossiblyInCurrentYear.value && last) {
    return `laatste in ${last.year.yyyy}`
  }
  return undefined
}

const top100BestInfo = computed(() => bestInfo(top100Entries.value, true))
const countdownBestInfo = computed(() => bestInfo(countdownOnlyEntries.value, !hasTop100Entries.value))
const top100LastText = computed(() => lastText(top100Entries.value))
const countdownLastText = computed(() => lastText(countdownOnlyEntries.value))

const detailSections = computed(() => {
  const sections: Array<{
    label: string
    count: number
    bestInfo?: BestInfo
    lastText?: string
  }> = []

  if (hasTop100Entries.value) {
    sections.push({
      label: 'top 100',
      count: top100Entries.value.length,
      bestInfo: top100BestInfo.value,
      lastText: top100LastText.value
    })
  }

  if (hasCountdownEntries.value) {
    sections.push({
      label: 'countdown',
      count: countdownOnlyEntries.value.length,
      bestInfo: countdownBestInfo.value,
      lastText: countdownLastText.value
    })
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
