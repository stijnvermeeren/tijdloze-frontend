<template>
  <div :class="['container', {open: isOpen, closed: !isOpen}]">
    <div ref="lyrics" />
    <h3>Lyrics</h3>

    <div class="lyricsContainer">
      <slot />
      <div @click.prevent="toggle()" class="toggle">
        <div>
          <a v-if="!isOpen">Meer tonen</a>
          <a v-else>Minder tonen</a>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'Lyrics',
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          const element = this.$refs['lyrics'];
          element.scrollIntoView({block: "nearest"});
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/globalStyles.less";

  div.container {
    div.lyricsContainer {
      position: relative;
      div.lyrics {
        padding: 0 20px 10px 20px;
      }
    }

    div.toggle {
      cursor: pointer;
      text-align: center;
      font-weight: bold;
    }

    &.closed {
      div.lyricsContainer {
        overflow: hidden;
        height: 90px;

        div.toggle {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 1) 15px,
            rgba(255, 255, 255, 0) 60px
          );

          div {
            position: absolute;
            bottom: 5px;
            width: 100%;
            text-align: center;
          }
        }
      }
    }
  }
</style>
