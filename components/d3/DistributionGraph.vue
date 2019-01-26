<template lang="pug">
  .graph
    h4(v-if='$slots.default || title')
      slot {{title}}
    svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
      g(:transform='`translate(${margin.left},${margin.top})`')
        tijdloze-axes(
          :x-scale='xScale'
          :y-scale='yScale'
          :years='years'
        )
        g.color-1
          circle.circle.coloredCircle(
            v-for='point in points'
            :cx='xScale(point.year._yy)'
            :cy='yScale(point.song.position(point.year))'
            r='3'
          )
        g.color-2
          circle.circle.coloredCircle(
            v-for='point in secondaryPoints'
            :cx='xScale(point.year._yy)'
            :cy='yScale(point.song.position(point.year))'
            r='3'
          )
</template>

<script>
  import BaseGraph from './BaseGraph';
  import BaseGraphAxes from './BaseGraphAxes';

  export default {
    extends: BaseGraph,
    components: {
      TijdlozeAxes: BaseGraphAxes
    },
    props: {
      title: {
        type: String
      },
      points: {
        type: Array,
        default: () => []
      },
      secondaryPoints: {
        type: Array,
        default: () => []
      }
    }
  }
</script>

<style lang="less" scoped>
  @import "../../assets/graphColors.less";

  div.graph {
    text-align: center;
    padding: 20px 0;

    svg {
      box-sizing: border-box;
      width: 100%;
      padding: 0 2em;
      background-color: white;
      font-size: 11px;
    }
  }
</style>
