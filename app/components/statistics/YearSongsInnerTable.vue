<template lang="pug">
table(:class='songsTableClass')
  tbody
    tr(v-for='entry in entries')
      td {{entry.song.position(entry.year)}}
      td.l
        song-with-cover(:song='entry.song')
      slot(name='extraCell' :entry='entry')
</template>

<script setup lang="ts">
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'

type EntryLike = SongYearEntry & Record<string, any>

withDefaults(
  defineProps<{
    entries: EntryLike[]
    songsTableClass?: string
  }>(),
  {
    songsTableClass: 'valueSong'
  }
)
</script>