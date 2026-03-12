<template lang="pug">
.graph(@mouseleave="hoverYear = undefined")
  v-btn-toggle(v-model="extended" mandatory density="compact" color="blue" variant="outlined")
    v-btn(:disabled="!hasTop100Entry" size="small" :value="false") Top 100
    v-btn(size="small" :value="true") Volledige lijst
  .tooltip(v-if="!!hoverYear && tooltipEntries.length" :style="tooltipStyle")
    .year
      | {{hoverYear.yyyy}}
    .entry(
      v-for="entry in tooltipEntries"
      :class="[entry.colorClass, { highlighted: hoverIndex === entry.index }]"
    )
      | {{entry.position}}. {{entry.song.title}}
  svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
    g(:transform='`translate(${margin.left},${margin.top})`')
      d3-axes(
        :x-scale='xScale'
        :y-scale='yScale'
        :years='years'
        :hover-year='hoverYear'
        :extended="extended"
      )
      polygon.greyBackground(v-if="extended" :points="greyBackgroundPoints")
      line(v-if="hoverLineX" :x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
      g(
        v-for='({song, isTop100}, index) in entries'
        :class="lineClasses(index, isTop100)"
      )
        path.coloredPath(:d='fullSongLine(song) ?? undefined')
        template(v-for='year in years' :key='year.yyyy')
          circle.circle.coloredCircle(
            v-if='song.position(year, extended)'
            :cx='xScale(year._yy)'
            :cy='yScale(song.position(year, extended) ?? 0)'
            r='3'
          )
      rect(
        :x="0"
        :y="0"
        :width="width"
        :height="height"
        @mousemove="onHover($event)"
        @touchmove="onHover($event)"
        :opacity="0"
      )

  .legend(v-if='!noLabel')
    template(v-for='({song, isTop100}, index) in entries' :key='song.id')
      div(
        v-if="extended || isTop100"
        :class="['songLegend', colorClass(index, isTop100), { highlighted: hoverIndex === index }]"
        @mouseover='onSongHover(index)'
        @mouseleave='onSongHover(undefined)'
      )
        | {{song.title}}
</template>

<script setup lang="ts">
import type Song from '~/orm/Song';
import type Year from '~/orm/Year';
import {probablyInListIntervals} from '~/utils/intervals';
import { sortBy } from 'ramda';

type GraphEntry = {
  song: Song
  isTop100: boolean
}

type TooltipEntry = {
  song: Song
  index: number
  colorClass: string
  position: number
}

const props = withDefaults(defineProps<{
  entries: GraphEntry[]
  noLabel?: boolean
}>(), {
  noLabel: false
})

const {width, height, fullWidth, fullHeight, margin} = useGraphConstants()
const {xBandScale, xScale, yScale, years, songLine, extended, greyBackgroundPoints} = useGraph()
const hover = useGraphHover(xBandScale, xScale, yScale, years)
const onHover = hover.onHover
const hoverYear = hover.hoverYear as Ref<Year | undefined>
const hoverLineX = hover.hoverLineX as Ref<number | undefined>
const tooltipStyle = hover.tooltipStyle

const hoverIndex = ref<number | undefined>(undefined)

const hasTop100Entry = computed(() => {
  return props.entries.some(entry => entry.isTop100)
})

watch(hasTop100Entry, (newValue) => {
  if (! newValue) {
    extended.value = true;
  }
}, { immediate: true })

const colorClass = computed(() => {
  return (index: number, isTop100: boolean) => {
    const maxColorIndex = 7
    if (props.entries.length <= maxColorIndex || isTop100) {
      return `color-${Math.min(index, maxColorIndex)}`
    } else {
      return 'color-other'
    }
  }
})

const tooltipEntries = computed(() => {
  const hoveredYear = hoverYear.value
  if (hoveredYear) {
    const tooltipEntries: TooltipEntry[] = [];
    props.entries.forEach(({song, isTop100}, index) => {
      const position = song.position(hoveredYear, extended.value);
      if (position) {
        tooltipEntries.push({song, index, colorClass: colorClass.value(index, isTop100), position})
      }
    });
    return sortBy((entry: TooltipEntry) => entry.position, tooltipEntries)
  } else {
    return [] as TooltipEntry[];
  }
})

function onSongHover(index: number | undefined) {
  hoverIndex.value = index;
}

function lineClasses(index: number, isTop100: boolean) {
  return [
    'line',
    colorClass.value(index, isTop100),
    {
      highlighted: hoverIndex.value === index,
      notHighlighted: hoverIndex.value !== undefined && hoverIndex.value !== index
    }
  ]
}

function fullSongLine(song: Song) {
  return songLine(
    song,
    probablyInListIntervals([song], years.value, extended.value)
  );
}
</script>

<style scoped>
  @import "../../assets/graphColors.css";
  
  div.graph {
    --hover-color: #AAAAAA;
    text-align: center;
    margin: 0 auto 20px auto;
    position: relative;

    div.tooltip {
      position: absolute;
      pointer-events: none;
      z-index: 1;
      top: 100px;
      padding: 2px 8px;
      border: 1px solid gray;
      border-radius: 4px;
      background-color: rgba(255, 255, 255, 0.9);
      text-align: left;
      font-size: 80%;

      div.year {
        font-weight: bold;
      }

      div.entry {
        &.highlighted {
          font-weight: bold;
        }
      }
    }

    svg {
      box-sizing: border-box;
      background-color: white;
      font-size: 11px;

      .greyBackground {
        fill: rgba(200, 200, 200, 0.5);
      }

      line {
        fill: none;
        stroke: var(--hover-color);
        shape-rendering: crispEdges;
        vector-effect: non-scaling-stroke;
      }

      .line {
        path {
          stroke-width: 1.5;
        }
        &.highlighted {
          path {
            stroke-width: 3;
          }
        }
        &.notHighlighted {
          opacity: 0.5;
        }
      }
    }
  }

  div.legend {
    div.songLegend {
      display: inline-block;
      margin: 0 1em;
      white-space: nowrap;
      font-size: 80%;
      &.highlighted {
        font-weight: bold;
      }
    }
  }
</style>
