<template lang="pug">
.graph(:style="{width: fullWidth}" @mouseleave="hoverYear = undefined")
  .tooltip(v-if="tooltipSong" :style="tooltipStyle")
    .year
      | {{hoverYear.yyyy}}
    .entry
      | {{tooltipSong.position(hoverYear)}}. {{tooltipSong.artist.fullName}} - {{tooltipSong.title}} ({{hoverYear.yyyy - tooltipSong.album.releaseYear}} jaar oud)
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
      line(:x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
      g.color-1
        rect.rect.coloredRect(
          v-for='point in points'
          :x='xScale(point.year._yy) - lineWidth(point.age) / 2'
          :y='yScale(point.position) - yStep / 2'
          :width='lineWidth(point.age)'
          :height='yStep'
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
</template>

<script setup>
import {useRootStore} from "~/stores/root";

const {fullWidth, fullHeight, width, height, margin} = useGraphConstants()
const {years, xScale, yScale} = useGraph()

const yStep = computed(() => {
  return yScale.value(1) - yScale.value(0);
})

const points = computed(() => {
  const songs = useRootStore().songs;
  const points = [];
  years.value.forEach(year => {
    songs.forEach(song => {
      if (song.position(year)) {
        points.push({
          year: year,
          position: song.position(year),
          age: year.yyyy - song.album.releaseYear
        });
      }
    })
  });

  return points;
})

const {onHover, hoverYear, hoverPosition, hoverLineX, tooltipStyle} = useGraphHover(xScale, yScale, years)

const tooltipSong = computed(() => {
  if (!!hoverYear.value && !!hoverPosition.value) {
    return useRootStore().listTop100(hoverYear.value).find(song => {
      return song.position(hoverYear.value) === hoverPosition.value;
    })
  }
  return undefined;
})

function lineWidth(age) {
  return 1 + age / 3;
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
        }
      }
    }
</style>
