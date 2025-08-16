<template lang="pug">
v-snackbar(:close-on-back="false" v-model="isOpen" :timeout="10000" timer="#f9bc85" v-if='song' color="#fdf0e0")
  div.snackbarContent
    .snackbarHeader
      | Op positie {{position}} in de Tijdloze van #[year-link(:year='year')]
    song-with-cover(:song="song")
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const {currentYear: year} = storeToRefs(useYearStore())
const {lastSong: song} = storeToRefs(useRootStore())

const isOpen = ref(false)

const position = computed(() => {
  if (song.value) {
    return song.value.position(year.value, true);
  }
})
watch(song, (newSong, oldSong) => {
  if (newSong && (!oldSong || oldSong.id !== newSong.id) && position.value <= 100) {
    isOpen.value = true
  }
})
</script>

<style lang="scss" scoped>
  @use "../assets/styleConfig";

  div.snackbarContent {
    display: flex;
    flex-direction: column;
    align-items: center;

    div.snackbarHeader {
      text-align: center;
      margin-bottom: 0.5em;
      font-style: italic;
    }
  }
</style>
