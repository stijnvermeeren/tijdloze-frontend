<template lang="pug">
div
  .graph(@mouseleave="hoverYear = undefined")
    h4(v-if='$slots.default || title')
      slot {{title}}
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
          :hover-year='hoverYear'
        )
        line(v-if="hoverLineX" :x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
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

<script setup>
  const {fullWidth, fullHeight, width, height, margin} = useGraphConstants()
  const {years, xBandScale, xScale, yScale} = useGraph()
  const {onHover, hoverYear, hoverLineX, hoverPosition, tooltipStyle} = useGraphHover(xBandScale, xScale, yScale, years)

  const props = defineProps({
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
  })

  const tooltipSong = computed(() => {
    if (!!hoverYear.value && !!hoverPosition.value) {
      const allPoints = props.points.concat(props.secondaryPoints)
      const matchingEntry = allPoints.find(point => {
        return point.year.yyyy === hoverYear.value.yyyy && point.song.position(hoverYear.value) === hoverPosition.value;
      });
      if (matchingEntry) {
        return matchingEntry.song;
      }
    }
    return undefined;
  })
</script>

<style lang="scss" scoped>
  @use "../../assets/graphColors";

  $hoverColor: #AAAAAA;

  h4 {
    font-size: 20px;
    margin-top: 1em;
    margin-bottom: 0.4em;
  }

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
