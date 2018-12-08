<template>
  <div :class="['container', {open: isOpen, closed: !isOpen}]" ref="lyrics">
    <h3 @click="isOpen = !isOpen">Lyrics</h3>
    <div class="lyrics">
      <slot />
      <div @click="toggle()" class="toggle">
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
          element.scrollIntoView();
        }
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../assets/globalStyles.less";

  div.container {
    background-color: @inputBackgroundColor;
    margin: 0 20px 40px 20px;

    h3 {
      position: relative;
      margin-left: 0;
      margin-right: 0;
      padding: 10px 20px;
      background-color: @menuBackgroundColor;

      span.arrow {
        position: absolute;
        right: 20px;
        font-weight: bold;
      }
    }

    > div.lyrics {
      position: relative;
      > div.lyrics {
        padding: 0 20px 10px 20px;
      }
    }

    div.toggle {
      padding: 5px 0;
      cursor: pointer;
      text-align: center;
      font-weight: bold;
    }

    &.closed {
      > div.lyrics {
        overflow: hidden;
        height: 80px;

        div.toggle {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          top: 0;
          background: linear-gradient(
            to top,
            rgba(253, 240, 224, 1) 5px,
            rgba(253, 240, 224, 0) 40px
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
