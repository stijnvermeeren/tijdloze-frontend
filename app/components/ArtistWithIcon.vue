<template lang="pug">
item-with-media
  template(#media)
    v-icon.artistIcon(:icon="mdiAccountMusic" color="grey")
  template(#title)
    artist-link(:artist="artist")
</template>

<script setup lang="ts">
import type Artist from "~/orm/Artist";
import { mdiAccountMusic } from "@mdi/js";

defineProps<{
  artist: Artist
}>()
</script>

<style scoped>
.artistIcon {
  height: 56px;
  width: 56px;
}
</style>
