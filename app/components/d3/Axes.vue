<template lang="pug">
g
  g.x.axis
    path.domain(:d='`M0,0 H ${rightX}`')
    template(v-for='year in years' :key='year.yyyy')
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

<script setup>
import Year from "../../orm/Year";

const props = defineProps({
  xScale: Function,
  yScale: Function,
  years: Array,
  hoverYear: Year,
  extended: {
    type: Boolean,
    default: false
  }
})

const {width} = useGraphConstants()

const yTickValues = computed(() => {
  if (props.extended) {
    return [1, 100, 250, 500, 750, 1000, 1250, 1500, 1750, 2000]
  } else {
    return [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
  }
})

const rightX = computed(() => {
  return width;
})

function isHoverYear(year) {
  return !!props.hoverYear && year.yyyy === props.hoverYear.yyyy;
}
function isNextToHoverYear(year) {
  const yearContext = useYearStore().context.forYear(year)
  return !!props.hoverYear && (
      (yearContext.previous?.year.yyyy === props.hoverYear.yyyy) ||
      (yearContext.next?.year.yyyy === props.hoverYear.yyyy)
  );
}
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
