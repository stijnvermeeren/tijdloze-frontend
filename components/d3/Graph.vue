<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="`translate(${margin.left},${margin.top})`">
                <g class="x axis">
                    <g v-for="year in years" class="tick" :transform="`translate(${xScale(year._yy)},0)`" style="opacity: 1;">
                        <line y2="-6" x2="0" />
                        <text dy="0em" y="-9" x="0" style="text-anchor: middle;">{{year._yy}}</text>
                    </g>
                    <path class="domain" :d="`M0,0 H ${width}`" />
                </g>
                <g class="y axis">
                    <g v-for="position in yTickValues" class="tick" :transform="`translate(0,${yScale(position)})`" style="opacity: 1;">
                        <line :x2="width" y2="0" />
                        <text dy=".32em" x="-3" y="0" style="text-anchor: end;">{{position}}</text>
                    </g>
                    <path class="domain" :d="`M0,0 V ${height}`" />
                </g>
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
    import {scaleLinear, scaleBand} from "d3-scale";
    import {line} from "d3-shape";
    import _ from 'lodash';

    export default {
      props: ['songs', 'hoverIndex'],
      data() {
        return {
          fullWidth: 750,
          fullHeight: 400,
          margin: {top: 40, right: 20, bottom: 10, left: 50},
          yTickValues: [1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]
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
            @axisColor: #777777;
            height: 400px;
            width: 750px;
            background-color: white;
            font-size: 11px;

            .axis {
                text {
                    fill: @axisColor;
                }

                path, line {
                    fill: none;
                    stroke: @axisColor;
                    shape-rendering: crispEdges;
                }
            }

            .y.axis .tick line {
                stroke-dasharray: 1, 3;
            }

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
