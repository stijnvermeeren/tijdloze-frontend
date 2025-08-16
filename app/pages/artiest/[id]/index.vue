<template lang="pug">
  v-checkbox.checkbox(v-model="byAlbum" density="compact" color="blue" variant="outlined" label="Per album" hide-details)
  div(v-if="!byAlbum")
    in-current-list(:songs='artist.allSongs' :artist='artist')
  div(v-else)
    in-current-list(:albums='artist.allAlbums' :artist='artist')
</template>


<script setup>
const props = defineProps({
  artist: Object
})

const byAlbum = ref(false)
</script>

<style lang="scss" scoped>
.checkbox {
  float: right;
  margin-top: -20px;
}
</style>