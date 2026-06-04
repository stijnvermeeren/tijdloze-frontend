<template lang="pug">
div.songWithCover
  div
    album-cover(:cover="song.album.cover" :key="mounted ? 'mounted' : 'initial'")
  div
    div.title
      song-link(:song='song')
    div.artist van #[song-artist-link(:song='song')] uit {{song.album.releaseYear}}
    div.attribution(v-if="attribution")
      | In de officiële lijst als "
      span {{attribution}}
      | "
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

const props = defineProps<{
  song: Song
  attribution?: string
}>()

// Fix for wrong covers on hydration mismatch on homepage. Better solution would be to avoid hydration mismatch...
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})

</script>

<style scoped>
div.songWithCover {
  display: flex;
  height: 64px;
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
  .attribution {
    font-size: 85%;
    color: #777;
    font-style: italic;
  }
}
</style>
