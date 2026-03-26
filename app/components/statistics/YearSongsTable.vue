<template lang="pug">
table.lijst.perEen
  tbody
    tr
      th.r Jaar
      th Aantal
      th(:class='headerClass')
        slot(name='songsHeader')
          | {{songsHeader}}
    tr(v-for='{year, entries} in listData')
      td.r
        year-link(:year='year')
      td {{entries.length}}
      td
        statistics-year-songs-inner-table(v-if='entries.length' :entries='entries' :songs-table-class='songsTableClass')
          template(#extraCell='{entry}')
            slot(name='extraCell' :entry='entry')
        div(v-else) /
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'
import type Year from '~/orm/Year'

type EntryLike = SongYearEntry & Record<string, any>

type YearEntryGroup = {
  year: Year
  entries: EntryLike[]
}

withDefaults(
  defineProps<{
    listData: YearEntryGroup[]
    songsHeader?: string
    songsTableClass?: string
    headerClass?: string
  }>(),
  {
    songsTableClass: 'valueSong'
  }
)
</script>