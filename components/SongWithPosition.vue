<template lang="pug">
div.entry
  div.position
    slot
      position-change(:song='song' :year='year')
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
