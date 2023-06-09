<template lang="pug">
div(:class="['container', {open: isOpen, closed: !isOpen}]")
  span(ref='lyrics')
  ui-card(title="Lyrics")
    .lyricsContainer
      slot
      .toggle(@click.prevent='toggle()')
        div
          a(v-if='!isOpen') Meer tonen
          a(v-else) Minder tonen
</template>

<script>
  export default defineNuxtComponent({
    data() {
      return {
        isOpen: false
      }
    },
    methods: {
      toggle() {
        this.isOpen = !this.isOpen;
        if (!this.isOpen) {
          const element = this.$refs.lyrics;
          element.scrollIntoView({ behavior: "smooth" });
        }
      }
    }
  })
</script>

<style lang="scss" scoped>
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
        max-height: 80px;
        position: relative;

        div.toggle {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          height: 50px;
          background: linear-gradient(
            to top,
            rgba(255, 255, 255, 1) 10px,
            rgba(255, 255, 255, 0) 50px
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
