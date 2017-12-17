<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <tijdloze-axes :xScale="xScale" :yScale="yScale" :years="years" />
                <g
                        v-for="(song, index) in songs"
                        :class="[
                          'line',
                          `color-${index}`,
                          {
                            highlighted: hoverIndex === index,
                            notHighlighted: hoverIndex !== null && hoverIndex !== index
                          }]"
                        @mouseover="onHover(index)"
                        @mouseleave="onHover(null)"
                >
                    <path :d="songLine(song)" class="coloredPath" />
                    <circle
                            v-for="year in years"
                            v-if="song.position(year)"
                            class="circle coloredCircle"
                            :cx="xScale(year._yy)"
                            :cy="yScale(song.position(year))"
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
      props: ['songs', 'hoverIndex'],
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
      },
      methods: {
        onHover(index) {
          this.$emit('hover', index);
        },
        songLine(song) {
          const halfBandWith = this.xScale.bandwidth() / 2;
          const undefinedPoint = {
            x: null,
            y: null,
            defined: false
          };

          const intervalLines = song.possiblyInListIntervals().map(interval => {
            const start = {
              x: this.xScale(_.first(interval)._yy) - halfBandWith,
              y: this.height,
              defined: true
            };

            const positions = interval
              .filter(year => song.position(year))
              .map(year => {
                return {
                  x: this.xScale(year._yy),
                  y: this.yScale(song.position(year)),
                  defined: true
                };
              });

            const lastYear = _.last(interval);
            if (lastYear.isCurrent()) {
              return _.flatten([start, positions, undefinedPoint]);
            } else {
              const end = {
                x: this.xScale(lastYear._yy) + halfBandWith,
                y: this.height,
                defined: true
              };
              return _.flatten([start, positions, end, undefinedPoint]);
            }
          });

          let songLine = line()
            .x(function(d) { return d.x; })
            .y(function(d) { return d.y; })
            .defined(function(d) { return d.defined; });
          return songLine(_.flatten(intervalLines));
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

            .line {
                path {
                    stroke-width: 1.5px;
                }
                &.highlighted {
                    path {
                        stroke-width: 3px;
                    }
                }
                &.notHighlighted {
                    opacity: 0.5;
                }
            }
        }
    }
</style>
