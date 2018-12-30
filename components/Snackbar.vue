<template>
  <div id="snackbar" :class="{isHidden: isHidden}">
    <div class="header">Positie {{song.position(year)}} in de Tijdloze van <tijdloze-year :year="year" /></div>
    <div class="song"><tijdloze-artist :artist="song.artist" /> - <tijdloze-song :song="song" /></div>
  </div>
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
      'song.id'() {
        this.refreshSnackbar()
      },
      'year.yyyy'() {
        this.refreshSnackbar()
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
