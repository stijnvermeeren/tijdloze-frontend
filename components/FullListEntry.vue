<template lang="pug">
div.entry(:class='{lineAfter: song.position(year, true) % 5 === 0}')
  div.position
    position-change(:song='song' :year='year')
  div.n
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
  },
  year: {
    type: Year
  }
})
</script>

<style lang="scss" scoped>
  div.entry {
    display: flex;
    height: 64px;
    align-items: center;

    &.header {
      font-weight: bold;
      overflow: auto;
      border-bottom: solid black 1px;
      scrollbar-gutter: stable;
    }

    > div {
      padding: 1px 7px;
    }

    .position {
      width: 80px;
      text-align: center;
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
