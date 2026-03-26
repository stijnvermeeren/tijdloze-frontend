<template lang="pug">
div.songWithCover
  div
    album-cover(:cover="song.album.cover" :key="mounted ? 'mounted' : 'initial'")
  div
    div.title
      song-link(:song='song')
    div.artist van #[song-artist-link(:song='song')] uit {{song.album.releaseYear}}
    div.details(v-if='showEntryStats && detailsSections.length')
      template(v-for='(section, index) in detailsSections' :key='section.label')
        template(v-if='index')
          | .
          | 
        span.font-weight-bold {{ section.count }}x
        |  {{ section.label }}
        template(v-if='section.bestInfo')
          | , hoogste:
          | 
          span.font-weight-bold {{ section.bestInfo.position }}
          template(v-if='section.bestInfo.count === 1')
            |  (in {{ section.bestInfo.firstYear }})
          template(v-else)
            |  ({{ section.bestInfo.count }}x tussen {{ section.bestInfo.firstYear }} en {{ section.bestInfo.lastYear }})
        template(v-if='section.lastText')
          | , {{ section.lastText }}
    div.attribution(v-if="attribution")
      | In de officiële lijst als "
      span {{attribution}}
      | "
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

type BestInfo = {
  position: number
  count: number
  firstYear: number
  lastYear: number
}

type DetailSection = {
  label: string
  count: number
  bestInfo?: BestInfo
  lastText?: string
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
  .attribution {
    font-size: 85%;
    color: #777;
    font-style: italic;
  }
}
</style>
