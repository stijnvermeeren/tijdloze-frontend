<template lang="pug">
.graph(@mouseleave="hoverYear = undefined")
  .tooltip(v-if="tooltipSong && hoverYear" :style="tooltipStyle")
    .year
      | {{hoverYear.yyyy}}
    .entry
      | {{tooltipSong.position(hoverYear)}}. {{tooltipSong.artist.name}} - {{tooltipSong.title}} ({{hoverYear.yyyy - tooltipSong.album.releaseYear}} jaar oud)
  svg(
    :viewBox='`0 0 ${fullWidth} ${fullHeight}`'
    xmlns='http://www.w3.org/2000/svg'
  )
    g(:transform='`translate(${margin.left},${margin.top})`')
      d3-axes(
        :x-scale='xScale'
        :y-scale='yScale'
        :years='years'
        :hover-year='hoverYear'
      )
      line(v-if="hoverLineX" :x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
      g.color-1
        rect.rect.coloredRect(
          v-for='point in points'
          :x='xScale(point.year._yy) - lineWidth(point.age) / 2'
          :y='yScale(point.position) - yStep / 2'
          :width='lineWidth(point.age)'
          :height='yStep'
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
</template>

<script setup lang="ts">
import type Song from "~/orm/Song";
import type Year from "~/orm/Year";
import {useRootStore} from "~/stores/root";

type AgePoint = {
  year: Year
  position: number
  age: number
}

const {fullWidth, fullHeight, width, height, margin} = useGraphConstants()
const {years, xBandScale, xScale, yScale} = useGraph()

const yStep = computed(() => {
  return yScale.value(1) - yScale.value(0);
})

const points = computed(() => {
  const songs = useRootStore().songs;
  const points: AgePoint[] = [];
  years.value.forEach(year => {
    songs.forEach(song => {
      const position = song.position(year)
      if (position) {
        points.push({
          year: year,
          position,
          age: year.yyyy - song.album.releaseYear
        });
      }
    })
  });

  return points;
})

const hover = useGraphHover(xBandScale, xScale, yScale, years)
const onHover = hover.onHover
const hoverYear = hover.hoverYear as Ref<Year | undefined>
const hoverPosition = hover.hoverPosition as Ref<number | undefined>
const hoverLineX = hover.hoverLineX as Ref<number | undefined>
const tooltipStyle = hover.tooltipStyle

const tooltipSong = computed(() => {
  if (!!hoverYear.value && !!hoverPosition.value) {
    return useRootStore().list(hoverYear.value, 100, 100).find(entry => {
      return entry.position === hoverPosition.value;
    })?.song
  }
  return undefined;
})

function lineWidth(age: number) {
  return 1 + age / 3;
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

        line {
          fill: none;
          stroke: var(--hover-color);
          shape-rendering: crispEdges;
        }
      }
    }
</style>
