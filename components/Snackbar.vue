<template lang="pug">
  #snackbar(v-if='song' :class='{isHidden: isHidden}')
    .header
      | Positie {{song.position(year, true)}} in de Tijdloze van #[tijdloze-year(:year='year')]
    .song
      | #[tijdloze-song-artist(:song='song')] - #[tijdloze-song(:song='song')]
</template>

<script>
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
        return this.$store.getters.lastSong;
      },
      year() {
        return this.$store.getters.currentYear;
      }
    },
    watch: {
      'song.id'(oldId, newId) {
        if (oldId !== newId) {
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
    }
  }
</script>

<style lang="less" scoped>
  @import "~assets/globalStyles.less";

  div#snackbar {
    position: fixed;
    top: 20px;
    right: 20px;

    border-radius: 5px;
    padding: 8px 16px;
    background-color: @inputBackgroundColor;
    text-align: center;

    transition: transform 2.0s;

    &.isHidden {
      transform: translateY(calc(-200% - 20px));
    }

    div.header {
      font-size: 14px;
    }

    div.song {
      font-size: 20px;
    }
  }
</style>
