<template lang="pug">
.graph(:style="{width: fullWidth}" @mouseleave="hoverYear = undefined")
  .tooltip(v-if="!!hoverYear && tooltipEntries.length" :style="tooltipStyle")
    .year
      | {{hoverYear.yyyy}}
    .entry(
      v-for="entry in tooltipEntries"
      :class="[`color-${entry.index}`, { highlighted: hoverIndex === entry.index }]"
    )
      | {{entry.position}}. {{entry.song.title}}
  svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
    g(:transform='`translate(${margin.left},${margin.top})`')
      d3-axes(
        :x-scale='xScale'
        :y-scale='yScale'
        :years='years'
        :hover-year='hoverYear'
      )
      line(:x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
      g(
        v-for='(song, index) in songs'
        :class="[\
          'line',\
          `color-${index}`,\
          {\
            highlighted: hoverIndex === index,\
            notHighlighted: hoverIndex !== undefined && hoverIndex !== index\
          }]"
      )
        path.coloredPath(:d='fullSongLine(song)')
        template(v-for='year in years' key='year.yyyy')
          circle.circle.coloredCircle(
            v-if='song.position(year)'
            :cx='xScale(year._yy)'
            :cy='yScale(song.position(year))'
            r='3'
          )
      rect.overlay(
        :x="0"
        :y="0"
        :width="width"
        :height="height"
        @mousemove="onHover($event)"
        @touchmove="onHover($event)"
        :opacity="0"
      )

  .legend(v-if='!noLabel')
    div(
      v-for='(song, index) in songs'
      :key='song.id'
      :class="['songLegend', `color-${index}`, { highlighted: hoverIndex === index }]"
      @mouseover='onSongHover(index)'
      @mouseleave='onSongHover(undefined)'
    )
      | {{song.title}}
</template>

<script setup>
import {probablyInListIntervals} from '~/utils/intervals';
import _ from "lodash"

const props = defineProps({
  songs: Array,
  noLabel: {
    type: Boolean,
    default: false
  }
})

const {width, height, fullWidth, fullHeight, margin} = useGraphConstants()
const {xScale, yScale, years, songLine} = useGraph()
const {onHover, hoverYear, hoverLineX, tooltipStyle} = useGraphHover(xScale, yScale, years)

const hoverIndex = ref(undefined)

const tooltipEntries = computed(() => {
  if (!!hoverYear.value) {
    const entries = [];
    props.songs.forEach((song, index) => {
      const position = song.position(hoverYear.value)
      if (position) {
        entries.push({song, index, position})
      }
    });
    return _.sortBy(entries, entry => entry.position);
  } else {
    return [];
  }
})

function onSongHover(index) {
  hoverIndex.value = index;
}

function fullSongLine(song) {
  return songLine(
    song,
    probablyInListIntervals([song], years.value)
  );
}
</script>

<style lang="scss" scoped>
  @use "../../assets/graphColors";
  $hoverColor: #AAAAAA;

  div.graph {
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

      line {
        fill: none;
        stroke: $hoverColor;
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
