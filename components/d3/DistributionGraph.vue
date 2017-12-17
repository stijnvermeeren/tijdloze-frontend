<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g class="color-1">
                    <circle
                            v-for="point in points"
                            class="circle coloredCircle"
                            :cx="xScale(point.year._yy)"
                            :cy="yScale(point.song.position(point.year))"
                            r="3"
                    />
                </g>
            </g>
        </svg>
    </div>
</template>

<script>
    import Axes from './Axes';
    import {scaleLinear, scaleBand} from "d3-scale";
    import {line} from "d3-shape";
    import _ from 'lodash';

    export default {
      components: {
        TijdlozeAxes: Axes
      },
      props: ['points'],
      data() {
        return {
          fullWidth: 750,
          fullHeight: 400,
          margin: {top: 40, right: 20, bottom: 10, left: 50}
        }
      },
      computed: {
        width() {
          return this.fullWidth - this.margin.left - this.margin.right;
        },
        height() {
          return this.fullHeight - this.margin.top - this.margin.bottom;
        },
        years() {
          return this.$store.getters.years;
        },
        xScale() {
          return scaleBand()
            .rangeRound([0, this.width])
            .paddingInner(0.1)
            .paddingOuter(0.5)
            .domain(this.years.map(year => year._yy));
        },
        yScale() {
          return scaleLinear()
            .range([0, this.height])
            .domain([0,101]);
        }
      }
    }
</script>

<style lang="less" scoped>
    @import "../../assets/graphColors.less";

    div.graph {
        text-align: center;
        padding: 20px 0;

        svg {
            height: 400px;
            width: 750px;
            background-color: white;
            font-size: 11px;
        }
    }
</style>
