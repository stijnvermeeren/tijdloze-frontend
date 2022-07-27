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
        tijdloze-axes(
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
          circle.circle.coloredCircle(
            v-for='year in years'
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

<script>
  import BaseGraph from './BaseGraph';
  import BaseGraphAxes from './BaseGraphAxes';
  import {probablyInListIntervals} from '~/utils/intervals';
  import {bisect} from "d3-array";
  import _ from "lodash"

  export default {
    extends: BaseGraph,
    components: {
      TijdlozeAxes: BaseGraphAxes
    },
    props: ['songs', 'noLabel'],
    data() {
      return {
        hoverIndex: undefined,
        hoverYear: undefined,
        overlayScreenWidth: undefined
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
        if (!!this.hoverYear && !!this.overlayScreenWidth) {
          if (this.hoverLineX > this.width - 200) {
            const tooltipRight = (this.margin.right + this.width - this.hoverLineX + this.xScale.step() * 4/5);
            const tooltipRightScreen = (tooltipRight * this.overlayScreenWidth / this.width) + "px";
            return {right: tooltipRightScreen};
          } else {
            const tooltipLeft = (this.margin.left + this.hoverLineX + this.xScale.step() * 2/3);
            const tooltipLeftScreen = (tooltipLeft * this.overlayScreenWidth / this.width) + "px";
            return {left: tooltipLeftScreen};
          }
        } else {
          return {};
        }
      },
      tooltipEntries() {
        if (!!this.hoverYear) {
          const entries = [];
          this.songs.forEach((song, index) => {
            const position = song.position(this.hoverYear)
            if (position) {
              entries.push({song, index, position})
            }
          });
          return _.sortBy(entries, entry => entry.position);
        } else {
          return [];
        }
      }
    },
    methods: {
      onSongHover(index) {
        this.hoverIndex = index;
      },
      onHover(event) {
        let offsetX;
        let boundingClientRect;

        if (event.offsetX) {
          boundingClientRect = event.target.getBoundingClientRect();
          offsetX = event.offsetX; // mouse event
        } else if (event.touches) {
          boundingClientRect = event.touches[0].target.getBoundingClientRect();
          offsetX = event.touches[0].pageX - boundingClientRect.x; // touch event
        } else {
          return;
        }

        this.overlayScreenWidth = boundingClientRect.width;
        const starts = this.years.map(year => this.xScale(year._yy) - this.xScale.step() / 2);
        const lookup = this.width / this.overlayScreenWidth * offsetX - this.margin.left;
        const hoverYear = this.years[bisect(starts, lookup) - 1];
        if (hoverYear) {
          this.hoverYear = hoverYear;
        }
      },
      fullSongLine(song) {
        return this.songLine(
          song,
          probablyInListIntervals([song], this.years)
        );
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
