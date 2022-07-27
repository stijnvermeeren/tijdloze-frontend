<template lang="pug">
  .graph(:style="{width: fullWidth}" @mouseleave="hoverYear = undefined")
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
          :hover-year="hoverYear"
        )
        line(:x1="hoverLineX" :x2="hoverLineX" :y1="0" :y2="height")
        g.color-1(v-for='song in songs')
          path.coloredPath(:d='stationarySongLine(song)')
          circle.circle.coloredCircle(
            v-for='year in stationaryYears(song)'
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

<script>
  import BaseGraph from './BaseGraph';
  import BaseGraphAxes from './BaseGraphAxes';
  import {bisect} from "d3-array";
  import _ from 'lodash';

  export default {
    extends: BaseGraph,
    components: {
      TijdlozeAxes: BaseGraphAxes
    },
    props: ['songs'],
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
          return this.$store.getters.list(this.hoverYear).find(song => {
            return song.position(this.hoverYear) === this.hoverPosition
                && this.stationaryYears(song).find(year => year.yyyy === this.hoverYear.yyyy);
          })
        }
        return undefined;
      }
    },
    methods: {
      stationarySongLine(song) {
        return this.songLine(song, song.stationaryIntervals(this.years), true);
      },
      stationaryYears(song) {
        return _.flatten(song.stationaryIntervals(this.years));
      },
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


<style lang="less" scoped>
  @import "../../assets/graphColors.less";

  @hoverColor: #AAAAAA;

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
        stroke: @hoverColor;
        shape-rendering: crispEdges;
      }
    }
  }
</style>
