<template>
    <span>
        <span v-if="equal" class="equal">=</span>
        <span v-if="down" class="down">&#8600;</span>
        <span v-if="up" class="up">&#8599;</span>
    </span>
</template>

<script>
  export default {
    props: ["song", "year"],
    computed: {
      position() {
        return this.song.position(this.year);
      },
      previousPosition() {
        if (this.year.previous()) {
          return this.song.position(this.year.previous());
        } else {
          return null;
        }
      },
      equal() {
        return this.year.previous() && this.position && this.position === this.previousPosition;
      },
      up() {
        return this.year.previous() && this.position && (!this.previousPosition || this.position > this.previousPosition);
      },
      down() {
        return this.year.previous() && this.previousPosition && (!this.position || this.position < this.previousPosition);
      }
    }
  }
</script>

<style lang="less" scoped>
    .movement(@color) {
        padding-right: 0.6em;
        color: @color;
    }

    span.up {
        .movement(#007700);
    }
    span.down {
        .movement(#aa0000);
    }
    span.equal {
        .movement(#444444);
    }
</style>
