<template lang="pug">
div.songWithCover
  div
    album-cover(:cover="song.album.cover")
  div
    div.title
      song-link(:song='song')
    div.artist van #[song-artist-link(:song='song')] uit {{song.album.releaseYear}}
</template>

<script setup>
import Song from "../orm/Song";
import Year from "../orm/Year";

defineProps({
  song: {
    type: Song
  }
})
</script>

<style lang="scss" scoped>
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
}
</style>
