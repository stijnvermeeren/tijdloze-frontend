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

<script setup lang="ts">
import type { ScaleLinear } from 'd3-scale'
import type Year from "~/orm/Year";

const props = withDefaults(defineProps<{
  xScale: (value: string) => number
  yScale: ScaleLinear<number, number>
  years: Year[]
  hoverYear?: Year
  extended?: boolean
}>(), {
  extended: false,
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

function isHoverYear(year: Year) {
  return !!props.hoverYear && year.yyyy === props.hoverYear.yyyy;
}

function isNextToHoverYear(year: Year) {
  const yearContext = useYearStore().context.forYear(year)
  return !!props.hoverYear && (
      (yearContext.previous?.year.yyyy === props.hoverYear.yyyy) ||
      (yearContext.next?.year.yyyy === props.hoverYear.yyyy)
  );
}
</script>

<style scoped>
  .axis {
    --axis-color: #777;
    --light-axis-color: #ddd;

    .tick {
      fill: var(--axis-color);

      &.highlighted {
        font-weight: bold;
      }

      &.nextToHighlighted {
        fill: var(--light-axis-color);
      }
    }

    path, line {
      fill: none;
      stroke: var(--axis-color);
      shape-rendering: crispEdges;
    }
  }

  .y.axis .tick line {
    stroke: var(--light-axis-color);
  }
</style>
