<template lang="pug">
v-img.cover(v-if="cover" :src="`/data/covers/${cover}.jpg`")
v-icon.cover(v-else :icon="mdiMusicBoxOutline" color="grey")
</template>

<script setup>
import {mdiMusicBoxOutline} from "@mdi/js";

defineProps({
  cover: String,
})
</script>

<style lang="scss">
.cover {
  height: 56px;
  width: 56px;
}
</style>
