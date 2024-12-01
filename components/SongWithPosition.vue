<template lang="pug">
div.entry
  div.position
    slot
      position-in-list(:song='song' :year='year' :hide-previous-next="hidePreviousNext")
  song-with-cover(:song="song")
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
  },
  hidePreviousNext: {
    type: Boolean,
    default: false
  }
})
</script>

<style lang="scss" scoped>
  div.entry {
    display: flex;
    height: 64px;
    align-items: center;

    .position {
      width: 80px;
      text-align: center;
    }
  }
</style>
