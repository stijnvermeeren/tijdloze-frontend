<template lang="pug">
img.cover(v-if="cover" :src="`/data/covers/${cover}.jpg`")
v-icon.cover(v-else :icon="mdiMusicBoxOutline" color="grey")
</template>

<script setup lang="ts">
import {mdiMusicBoxOutline} from "@mdi/js";

defineProps<{
  cover?: string
}>()
</script>

<style>
.cover {
  height: 56px;
  width: 56px;
}
</style>
