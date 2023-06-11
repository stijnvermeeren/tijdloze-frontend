<template lang="pug">
span(v-if='position')
  span.equal(v-if='equal') =
  span.down(v-if='down') &searr;&#xFE0E;
  span.up(v-if='up') &nearr;&#xFE0E;
</template>

<script>
  import Year from "../orm/Year";

  export default {
    props: {
      song: Object,
      year: Year
    },
    computed: {
      position() {
        return this.song.position(this.year, true);
      },
      previousPosition() {
        if (this.year.previous) {
          return this.song.position(this.year.previous, true);
        } else {
          return null;
        }
      },
      equal() {
        return this.year.previous && this.position && this.position === this.previousPosition;
      },
      up() {
        return this.year.previous && this.position && (!this.previousPosition || this.position < this.previousPosition);
      },
      down() {
        return this.year.previous && this.previousPosition && (!this.position || this.position > this.previousPosition);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @mixin movement($color) {
    padding-right: 0.6em;
    color: $color;
  }

  span.up {
    @include movement(#007700);
  }
  span.down {
    @include movement(#aa0000);
  }
  span.equal {
    @include movement(#444444);
  }
</style>
