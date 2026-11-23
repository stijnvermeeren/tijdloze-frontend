<template lang="pug">
item-with-media
  template(#media)
    v-icon.artistIcon(:icon="mdiAccountMusic" color="grey")
  template(#title)
    artist-link(v-if="!plainTitle" :artist="artist" :tabindex="tabindex")
    span(v-else) {{artist.name}}
</template>

<script setup lang="ts">
import type Artist from "~/orm/Artist";
import { mdiAccountMusic } from "@mdi/js";

defineProps<{
  artist: Artist
  tabindex?: number
  plainTitle?: boolean
}>()
</script>

<style scoped>
.artistIcon {
  height: 56px;
  width: 56px;
}
</style>
