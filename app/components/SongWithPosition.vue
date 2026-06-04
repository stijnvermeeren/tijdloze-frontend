<template lang="pug">
div.entry
  div.position
    slot
      position-in-list(:song='song' :override-position="overridePosition" :year='year' :hide-previous-next="hidePreviousNext")
  song-with-cover(:song="song" :attribution="attribution")
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";
import type Year from "~/orm/Year";

defineProps<{
  song: Song
  attribution?: string
  overridePosition?: number
  year: Year
  hidePreviousNext?: boolean
}>()
</script>

<style scoped>
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
