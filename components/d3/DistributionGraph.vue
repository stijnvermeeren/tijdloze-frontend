<template lang="pug">
div
  .graph(:style="{width: fullWidth}" @mouseleave="hoverYear = undefined")
    h4(v-if='$slots.default || title')
      slot {{title}}
    .tooltip(v-if="tooltipSong" :style="tooltipStyle")
      .year
        | {{hoverYear.yyyy}}
      .entry
        | {{tooltipSong.position(hoverYear)}}. {{tooltipSong.artist.fullName}} - {{tooltipSong.title}}
    svg(:viewBox='`0 0 ${fullWidth} ${fullHeight}`' xmlns='http://www.w3.org/2000/svg')
      g(:transform='`translate(${margin.left},${margin.top})`')
        tijdloze-axes(
          :x-scale='xScale'
          :y-scale='yScale'
          :years='years'
          :hover-year='hoverYear'
        )
        line(:x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
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

<script>
  import BaseGraph from './BaseGraph';
  import BaseGraphAxes from './BaseGraphAxes';
  import {bisect} from "d3-array";

  export default {
    extends: BaseGraph,
    components: {
      TijdlozeAxes: BaseGraphAxes
    },
    props: {
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
    },
    data() {
      return {
        hoverYear: undefined,
        hoverPosition: undefined,
        overlayScreenWidth: undefined,
        overlayScreenHeight: undefined
      }
    },
    computed: {
      hoverLineX() {
        if (this.hoverYear) {
          return this.xScale(this.hoverYear._yy);
        } else {
          return this.xScale.range()[1];
        }
      },
      tooltipStyle() {
        if (!!this.hoverYear && !!this.hoverPosition && !!this.overlayScreenWidth && !!this.overlayScreenHeight) {
          const tooltipTop = (this.margin.top + this.yScale(this.hoverPosition));
          const tooltipTopScreen = (tooltipTop * this.overlayScreenHeight / this.height) + "px";

          if (this.hoverLineX > this.width - 200) {
            const tooltipRight = (this.margin.right + this.width - this.hoverLineX + this.xScale.step() * 4/5);
            const tooltipRightScreen = (tooltipRight * this.overlayScreenWidth / this.width) + "px";
            return {right: tooltipRightScreen, top: tooltipTopScreen};
          } else {
            const tooltipLeft = (this.margin.left + this.hoverLineX + this.xScale.step() * 2/3);
            const tooltipLeftScreen = (tooltipLeft * this.overlayScreenWidth / this.width) + "px";
            return {left: tooltipLeftScreen, top: tooltipTopScreen};
          }
        } else {
          return {};
        }
      },
      tooltipSong() {
        if (!!this.hoverYear && !!this.hoverPosition) {
          const matchingEntry = this.points.concat(this.secondaryPoints).find(point => {
            return point.year.yyyy === this.hoverYear.yyyy && point.song.position(this.hoverYear) === this.hoverPosition;
          });
          if (matchingEntry) {
            return matchingEntry.song;
          }
        }
        return undefined;
      }
    },
    methods: {
      onHover(event) {
        let offsetX;
        let offsetY;
        let boundingClientRect;

        if (event.offsetX) {
          // mouse event
          boundingClientRect = event.target.getBoundingClientRect();
          offsetX = event.offsetX;
          offsetY = event.offsetY;
        } else if (event.touches) {
          // touch event
          boundingClientRect = event.touches[0].target.getBoundingClientRect();
          offsetX = event.touches[0].pageX - boundingClientRect.x;
          offsetY = event.touches[0].pageY - boundingClientRect.y;
        } else {
          return;
        }

        this.overlayScreenWidth = boundingClientRect.width;
        this.overlayScreenHeight = boundingClientRect.height;

        const starts = this.years.map(year => this.xScale(year._yy) - this.xScale.step() / 2);
        const lookup = this.width / this.overlayScreenWidth * offsetX - this.margin.left;
        const hoverYear = this.years[bisect(starts, lookup) - 1];
        if (hoverYear) {
          this.hoverYear = hoverYear;
        }

        const positionLookup = this.height / this.overlayScreenHeight * offsetY - this.margin.top;
        const hoverPosition = Math.round(this.yScale.invert(positionLookup));
        if (hoverPosition) {
          this.hoverPosition = hoverPosition;
        }
      }
    }
  }
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
