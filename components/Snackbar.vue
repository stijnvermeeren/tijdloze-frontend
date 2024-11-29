<template lang="pug">
v-snackbar(:close-on-back="false" v-model="isOpen" :timeout="10000" timer="#f9bc85" v-if='song' color="#fdf0e0")
  div.snackbarContent
    .snackbarHeader
      | Op positie {{position}} in de Tijdloze van #[year-link(:year='year')]
    song-with-cover(:song="song")
</template>

<script>
  import {useRootStore} from "~/stores/root";

  const rootStore = useRootStore()

  export default {
    name: "Snackbar",
    data() {
      return {
        isOpen: false
      }
    },
    computed: {
      song() {
        return rootStore.lastSong;
      },
      year() {
        return rootStore.currentYear;
      },
      position() {
        if (this.song) {
          return this.song.position(this.year, true);
        }
      }
    },
    watch: {
      song(newSong, oldSong) {
        if (newSong && (!oldSong || oldSong.id !== newSong.id) && this.position <= 100) {
          this.isOpen = true
        }
      }
    },
    ssrComputedCache: true
  }
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
