<template lang="pug">
#snackbar(v-if='song' :class='{isHidden: isHidden}')
  .snackbarHeader
    | Positie {{position}} in de Tijdloze van #[year-link(:year='year')]
  .song
    | #[song-artist-link(:song='song')] - #[song-link(:song='song')]
</template>

<script>
  import {useRootStore} from "~/stores/root";

  const rootStore = useRootStore()

  export default {
    name: "Snackbar",
    data() {
      return {
        isHidden: true,
        closeTimeout: undefined
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
          this.refreshSnackbar()
        }
      }
    },
    methods: {
      refreshSnackbar() {
        this.isHidden = false;
        if (this.closeTimeout) {
          clearTimeout(this.closeTimeout)
        }

        this.closeTimeout = setTimeout(this.close, 10000)
      },
      close() {
        this.isHidden = true;
      }
    },
    ssrComputedCache: true
  }
</script>

<style lang="scss" scoped>
  @use "../assets/styleConfig";

  div#snackbar {
    position: fixed;
    top: 20px;
    right: 20px;

    border-radius: 5px;
    padding: 8px 16px;
    background-color: styleConfig.$inputBackgroundColor;
    text-align: center;

    transition: transform 2.0s;

    &.isHidden {
      transform: translateY(calc(-200% - 20px));
    }

    div.snackbarHeader {
      font-size: 14px;
    }

    div.song {
      font-size: 20px;
    }
  }
</style>
