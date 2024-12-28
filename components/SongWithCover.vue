<template lang="pug">
div.songWithCover
  div
    album-cover(:cover="song.album.cover" :key="mounted")
  div
    div.title
      song-link(:song='song')
    div.artist van #[song-artist-link(:song='song')] uit {{song.album.releaseYear}}
</template>

<script setup>
const props = defineProps({
  song: {
    type: Object
  }
})

// Fix for wrong covers on hydration mismatch on homepage. Better solution would be to avoid hydration mismatch...
const mounted = ref(false)
onMounted(() => {
  mounted.value = true
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
