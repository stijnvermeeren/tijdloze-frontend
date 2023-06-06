<template lang="pug">
div
  d3-distribution-graph(:points='finalPoints' :secondary-points='nonFinalPoints')
  .legende
    ul
      li
        d3-color-label(:index='1')
        |  Definitieve eenjaarsvliegen (slechts één notering in alle lijsten)
      li
        d3-color-label(:index='2')
        |  Niet-definitieve eenjaarsvliegen
</template>

<script>
  export default {
    props: {
      data: Array
    },
    computed: {
      finalPoints() {
        return this.data.filter(point => point.isFinal);
      },
      nonFinalPoints() {
        return this.data.filter(point => !point.isFinal);
      }
    }
  }
</script>

<style lang="scss" scoped>
  @use "../../../assets/styleConfig";

  div.legende {
    ul {
      @include styleConfig.noBullets;
      max-width: 40em;
      margin: 0 auto;
      li {
        text-align: left;
      }
      img {
        margin-right: 2em;
        vertical-align: bottom;
        @include styleConfig.border;
      }
    }
  }
</style>
