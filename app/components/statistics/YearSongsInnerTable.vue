<template lang="pug">
div(:class="['tableWrapper', { isExpanded: isExpanded }]")
  div.my-1.countRow
    div.countLeft
      span.font-weight-bold {{ totalEntries }} {{ countLabel }}
      |  in {{ props.displayYear.yyyy }}
    div.countRight
      v-btn-toggle(v-if='totalEntries > 1' v-model='isExpanded' mandatory density='compact')
        v-btn(size='small' :value='false' density='compact' :prepend-icon='mdiFormatVerticalAlignTop') Hoogste
        v-btn(size='small' :value='true' density='compact' :prepend-icon='mdiUnfoldMoreHorizontal') Alle
  table(:class='songsTableClass')
    tbody
      tr(v-for='(entry, index) in props.entries' :key='entry.song.id' v-show='isExpanded || index < 1')
        td.l
          song-with-position(:song='entry.song' :year='entry.year')
            position-main(:position='entry.song.position(entry.year)')
            slot(name='positionAnnotation' :entry='entry')
        slot(name='extraCell' :entry='entry')
</template>

<script setup lang="ts">
import { mdiFormatVerticalAlignTop, mdiUnfoldMoreHorizontal } from '@mdi/js'
import type { SongYearEntry } from '~/types/statistieken/songYearEntry'
import type Year from '~/orm/Year'

type EntryLike = SongYearEntry & Record<string, any>

const props = withDefaults(
  defineProps<{
    entries: EntryLike[]
    displayYear: Year
    songsTableClass?: string
    countLabelSingular: string
    countLabelPlural: string
  }>(),
  {
    songsTableClass: 'valueSong'
  }
)

const isExpanded = ref(false)

const totalEntries = computed(() => props.entries.length)
const countLabel = computed(() => totalEntries.value === 1 ? props.countLabelSingular : props.countLabelPlural)
</script>

<style scoped>
.countRow {
  display: grid;
  grid-template-columns: 1fr 1fr;
  align-items: center;
  column-gap: 24px;
  background-color: rgba(0, 0, 0, 0.04);
  border-radius: 4px;
  padding: 2px 16px;
}

.countLeft {
  text-align: left;
}

.countRight {
  text-align: right;
}

:deep(.v-btn-group--density-compact.v-btn-group) {
  height: 28px;
}

:deep(.attribution) {
  font-size: 85%;
  color: #777;
  font-style: italic;
}
</style>
