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
      previousYear() {
        return this.song.years.previousYear(this.year);
      },
      previousPosition() {
        if (this.previousYear) {
          return this.song.position(this.previousYear);
        } else {
          return null;
        }
      },
      equal() {
        return this.previousYear && this.position && this.position === this.previousPosition;
      },
      up() {
        return this.previousYear && this.position && (!this.previousPosition || this.position > this.previousPosition);
      },
      down() {
        return this.previousYear && this.previousPosition && (!this.position || this.position < this.previousPosition);
      }
    }
  }
</script>
