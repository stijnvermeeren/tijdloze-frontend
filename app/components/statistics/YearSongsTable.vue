<template lang="pug">
table.lijst.perEen.withTopBorder
  tbody
    tr(v-for='{year, entries} in listData')
      td.r
        year-link(:year='year')
      td
        statistics-year-songs-inner-table(:entries='entries' :display-year='year' :songs-table-class='songsTableClass' :count-label-singular='countLabelSingular' :count-label-plural='countLabelPlural')
          template(#positionAnnotation='{entry}')
            slot(name='positionAnnotation' :entry='entry')
          template(#extraCell='{entry}')
            slot(name='extraCell' :entry='entry')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'
import type Year from '~/orm/Year'

type EntryLike = SongYearEntry & Record<string, any>

type YearEntryGroup = {
  year: Year
  entries: EntryLike[]
}

const props = withDefaults(
  defineProps<{
    listData: YearEntryGroup[]
    songsTableClass?: string
    countLabelSingular: string
    countLabelPlural: string
  }>(),
  {
    songsTableClass: 'valueSong'
  }
)
</script>

<style scoped>
.withTopBorder {
  border-top: 1px #888888 dotted;;
}
</style>