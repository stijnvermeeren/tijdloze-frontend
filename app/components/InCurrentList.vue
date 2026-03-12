<template lang="pug">
div.container
  div(v-if='(songs && songs.length) || (albums && albums.length)')
    template(v-if="albums" v-for="album in albums" :key="album.id")
      div.currentListHeader
        album-link(:album="album")
        |  ({{album.releaseYear}})
      in-current-list-section(:songs="albumSongs(album)")
    template(v-if="songs")
      template(v-if="currentYear && top100Songs.length")
        div.currentListHeader In de top 100 van {{currentYear.yyyy}}
        in-current-list-section(:songs='top100Songs')
      template(v-if="currentYear && fullListSongs.length")
        div.currentListHeader In de countdown van {{currentYear.yyyy}}
        in-current-list-section(:songs='fullListSongs')
      template(v-if="otherSongs.length")
        div.currentListHeader Vroeger in de Tijdloze
        in-current-list-section(:songs='otherSongs')
  div(v-else)
    | Nog geen nummers in de Tijdloze.
</template>

<script setup lang="ts">
import type Artist from "~/orm/Artist";
import type Album from "~/orm/Album";
import type Song from "~/orm/Song";

const props = withDefaults(defineProps<{
  songs?: Song[]
  albums?: Album[]
  artist?: Artist
}>(), {
  songs: () => [],
  albums: () => []
})

const {currentYear} = storeToRefs(useYearStore())

const top100Songs = computed(() => {
  return props.songs.filter(song => sortBlock(song) === 1)
})
const fullListSongs = computed(() => {
  return props.songs.filter(song => sortBlock(song) === 2)
})
const otherSongs = computed(() => {
  return props.songs.filter(song => sortBlock(song) === 3)
})

function sortBlock(song: Song) {
  if (!currentYear.value) {
    return 3
  }
  if (song.probablyInList(currentYear.value)) {
    // songs that are probably still in the top 100
    return 1;
  } else if (song.probablyInList(currentYear.value, true)) {
    // songs that are already in the list
    return 2;
  } else {
    return 3;
  }
}
function albumSongs(album: Album): Song[] {
  // Only show songs linked to the current artist (in case this album is actually from a different artist)
  // Test e.g. with the Daft Punk album Random Access Memories.
  const artistId = props.artist?.id
  return artistId
    ? album.songs.filter((song: Song) => song.artistId === artistId || song.secondArtistId === artistId)
    : album.songs
}
</script>


<style scoped>
div.currentListHeader {
  font-weight: bold;
  margin: 0.3em 0 0.1em;
}
</style>
