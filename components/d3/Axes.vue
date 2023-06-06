<template lang="pug">
g
  g.x.axis
    path.domain(:d='`M0,0 H ${rightX}`')
    template(v-for='year in years' key='year.yyyy')
      g.tick(
        v-if='year.yyyy % 10 === 0 && !isHoverYear(year)'
        :transform='`translate(${xScale(year._yy)},0)`'
        :class="{nextToHighlighted: isNextToHoverYear(year)}"
      )
        line(y2='-6' x2='0')
        text(dy='0em' y='-9' x='0' style='text-anchor: middle;')
          | {{year.yyyy}}
      g.tick(
        v-if="!!hoverYear"
        :transform='`translate(${xScale(hoverYear._yy)},0)`'
        class="highlighted"
      )
        line(y2='-6' x2='0')
        text(dy='0em' y='-9' x='0' style='text-anchor: middle;')
          | {{hoverYear.yyyy}}

  g.y.axis
    path.domain(:d='`M${rightX},0 V ${yScale.range()[1]}`')
    g.tick(
      v-for='position in yTickValues'
      :transform='`translate(${rightX},${yScale(position)})`'
      style='opacity: 1;'
    )
      line(:x2='-rightX' y2='0')
      text(dy='.32em' x='3' y='0' style='text-anchor: start;')
        | {{position}}
</template>

<script>
  import Year from "../../orm/Year";

  export default defineNuxtComponent({
    props: {
      xScale: Function,
      yScale: Function,
      years: Array,
      hoverYear: Year
    },
    data() {
      return {
        yTickValues: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
      }
    },
    computed: {
      rightX() {
        return this.xScale.range()[1];
      }
    },
    methods: {
      isHoverYear(year) {
        return !!this.hoverYear && year.yyyy === this.hoverYear.yyyy;
      },
      isNextToHoverYear(year) {
        return !!this.hoverYear && (
            (year.previous()?.yyyy === this.hoverYear.yyyy) ||
            (year.next()?.yyyy === this.hoverYear.yyyy)
        );
      }
    }
  })
</script>

<style lang="scss" scoped>
  $axisColor: #777;
  $lightAxisColor: #ddd;

  .axis {
    .tick {
      fill: $axisColor;

      &.highlighted {
        font-weight: bold;
      }

      &.nextToHighlighted {
        fill: $lightAxisColor;
      }
    }

    path, line {
      fill: none;
      stroke: $axisColor;
      shape-rendering: crispEdges;
    }
  }

  .y.axis .tick line {
    stroke: $lightAxisColor;
  }
</style>
