<template lang="pug">
item-with-media
  template(#media)
    album-cover(:cover="song.album.cover" :key="mounted ? 'mounted' : 'initial'")
  template(#title)
    song-link(:song='song')
  template(#subtitle)
    | van #[song-artist-link(v-if="!plainArtist" :song='song')]#[span(v-if="plainArtist") {{song.secondArtist ? song.artist.name + ' en ' + song.secondArtist.name : song.artist.name}}] uit {{song.album.releaseYear}}
  template(v-if="attribution" #extra)
    | In de officiële lijst als "
    span {{attribution}}
    | "
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";

const props = defineProps<{
  song: Song
  attribution?: string
  plainArtist?: boolean
}>()

// Fix for wrong covers on hydration mismatch on homepage.
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
})
</script>
