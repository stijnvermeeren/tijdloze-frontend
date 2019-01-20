<template lang="pug">
  g
    g.x.axis
      path.domain(:d='`M0,0 H ${xScale.range()[1]}`')
      g.tick(
        v-for='year in years'
        :transform='`translate(${xScale(year._yy)},0)`'
        style='opacity: 1;'
      )
        line(y2='-6' x2='0')
        text(dy='0em' y='-9' x='0' style='text-anchor: middle;')
          | {{year._yy}}

    g.y.axis
      path.domain(:d='`M0,0 V ${yScale.range()[1]}`')
      g.tick(
        v-for='position in yTickValues'
        :transform='`translate(0,${yScale(position)})`'
        style='opacity: 1;'
      )
        line(:x2='xScale.range()[1]' y2='0')
        text(dy='.32em' x='-3' y='0' style='text-anchor: end;')
          | {{position}}
</template>

<script>
  export default {
    props: ['xScale', 'yScale', 'years'],
    data() {
      return {
        yTickValues: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      }
    }
  }
</script>

<style lang="less" scoped>
  @axisColor: #777777;

  .axis {
    text {
      fill: @axisColor;
    }

    path, line {
      fill: none;
      stroke: @axisColor;
      shape-rendering: crispEdges;
    }
  }

  .y.axis .tick line {
    stroke-dasharray: 1, 3;
  }
</style>
