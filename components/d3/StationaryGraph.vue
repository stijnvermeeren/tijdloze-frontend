<template lang="pug">
.graph(:style="{width: fullWidth}" @mouseleave="hoverYear = undefined")
  .tooltip(v-if="tooltipSong" :style="tooltipStyle")
    .year
      | {{hoverYear.yyyy}}
    .entry
      | {{tooltipSong.position(hoverYear)}}. {{tooltipSong.artist.name}} - {{tooltipSong.title}}
  svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
    g(:transform='`translate(${margin.left},${margin.top})`')
      d3-axes(
        :x-scale='xScale'
        :y-scale='yScale'
        :years='years'
        :hover-year="hoverYear"
      )
      line(:x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
      g.color-1(v-for='song in songs')
        path.coloredPath(:d='stationarySongLine(song)')
        template(v-for='year in stationaryYears(song)' :key="year.yyyy")
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
</template>

<script setup>
  import _ from 'lodash';
  import {useRootStore} from "~/stores/root";

  const {fullWidth, fullHeight, width, height, margin} = useGraphConstants()
  const {years, xScale, yScale, songLine} = useGraph()
  const {onHover, hoverYear, hoverLineX, hoverPosition, tooltipStyle} = useGraphHover(xScale, yScale, years)

  defineProps({
    songs: Array
  })

  const tooltipSong = computed(() => {
    if (!!hoverYear.value && !!hoverPosition.value) {
      return useRootStore().listTop100(hoverYear.value).find(song => {
        return song.position(hoverYear.value) === hoverPosition.value
          && stationaryYears(song).find(year => year.yyyy === hoverYear.value.yyyy);
      })
    }
    return undefined;
  })

  function stationarySongLine(song) {
    return songLine(song, song.stationaryIntervals(years.value), true);
  }

  function stationaryYears(song) {
    return _.flatten(song.stationaryIntervals(years.value));
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
