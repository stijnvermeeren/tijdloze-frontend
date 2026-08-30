<template lang="pug">
div.songWithCover
  div
    album-cover(:cover="song.album.cover" :key="mounted ? 'mounted' : 'initial'")
  div
    div.title
      song-link(:song='song')
    div.artist van #[song-artist-link(:song='song')] uit {{song.album.releaseYear}}
    div.details(v-if='showEntryStats && detailsSections.length')
      span.mr-4(v-for='(section, index) in detailsSections' :key='section.label')
        span.font-weight-bold {{ section.count }}x
        |  {{ section.label }}
        template(v-if='section.firstYear !== undefined')
          |  ({{ section.firstYear }}
          template(v-if='section.firstYear !== section.lastYear')
            v-icon.details-icon(:icon='section.continuous ? mdiMenuRight : mdiMenuRightOutline' :size='section.continuous ? 16 : 13' :title="section.continuous ? 'doorlopend' : 'tussen jaren'")
            template(v-if='section.lastYear !== undefined')
              |  {{ section.lastYear }}
            template(v-else)
              |  ...
          | )
        template(v-if='section.bestInfo')
          | ,
          | 
          v-icon.details-icon(:icon='mdiChevronDoubleUp' size='14' title="hoogste positie")
          span.font-weight-bold {{ section.bestInfo.position }}
          template(v-if='section.bestInfo.count === 1')
            |  (in {{ section.bestInfo.firstYear }})
          template(v-else)
            |  ({{ section.bestInfo.count }}x,
            | 
            |  {{ section.bestInfo.firstYear }}
            v-icon.details-icon(:icon='section.bestInfo.continuous ? mdiMenuRight : mdiMenuRightOutline' :size='section.bestInfo.continuous ? 16 : 13' :title="section.bestInfo.continuous ? 'doorlopend' : 'tussen jaren'")
            | {{ section.bestInfo.lastYear }})
        | .
    div.attribution(v-if="attribution")
      | In de officiële lijst als "
      span {{attribution}}
      | "
</template>

<script setup lang="ts">
import { mdiChevronDoubleUp, mdiChevronDoubleRight, mdiMenuRight, mdiMenuRightOutline } from '@mdi/js'
import type Song from "~/orm/Song";

type BestInfo = {
  position: number
  count: number
  firstYear: number
  lastYear: number
  continuous?: boolean
}

type DetailSection = {
  label: string
  count: number
  firstYear?: number
  lastYear?: number
  continuous?: boolean
  bestInfo?: BestInfo
}

const props = defineProps<{
  song: Song
  attribution?: string
  showEntryStats?: boolean
  detailsSections?: DetailSection[]
}>()

const detailsSections = computed(() => props.detailsSections ?? [])

// Fix for wrong covers on hydration mismatch on homepage. Better solution would be to avoid hydration mismatch...
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

</script>

<style scoped>
div.songWithCover {
  display: flex;
  min-height: 64px;
  align-items: center;

  >div {
    padding: 1px 7px;
  }

  .title {
    font-weight: bold;
  }
  .artist {
    font-size: 85%;
    color: #777;
  }
  .details {
    font-size: 85%;
    color: #666;
  }
  .details-icon {
    vertical-align: text-bottom;
  }
  .attribution {
    font-size: 85%;
    color: #777;
    font-style: italic;
  }
}
</style>
