<template lang="pug">
  div
    tijdloze-distribution-graph(:points='finalPoints' :secondary-points='nonFinalPoints')
    .legende
      ul
        li
          tijdloze-color-label(:index='1')
          |  Definitieve eenjaarsvliegen (slechts één notering in alle lijsten)
        li
          tijdloze-color-label(:index='2')
          |  Niet-definitieve eenjaarsvliegen
</template>

<script>
  import DistributionGraph from "../../../components/d3/DistributionGraph"
  import ColorLabel from "../../../components/d3/ColorLabel"

  export default {
    components: {
      TijdlozeDistributionGraph: DistributionGraph,
      TijdlozeColorLabel: ColorLabel
    },
    props: ['data'],
    computed: {
      finalPoints() {
        return this.data.filter(point => !point.isFinal);
      },
      nonFinalPoints() {
        return this.data.filter(point => point.isFinal);
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../../assets/styleConfig";

  div.legende {
    ul {
      .noBullets;
      max-width: 40em;
      margin: 0 auto;
      li {
        text-align: left;
      }
      img {
        margin-right: 2em;
        vertical-align: bottom;
        .border;
      }
    }
  }
</style>
