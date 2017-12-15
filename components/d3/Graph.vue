<template>
    <div class="graph">
        <svg :width="fullWidth" :height="fullHeight">
            <g :transform="'translate(' + margin.left + ',' + margin.top + ')'">
                <g class="x axis">
                    <g v-for="year in years" class="tick" :transform="'translate(' + xScale(year._yy) + ',0)'" style="opacity: 1;">
                        <line y2="-6" x2="0" />
                        <text dy="0em" y="-9" x="0" style="text-anchor: middle;">{{year._yy}}</text>
                    </g>
                </g>
                <g class="y axis">

                </g>
            </g>
        </svg>
    </div>
</template>

<script>
    import {scaleLinear, scaleBand} from "d3-scale";

    export default {
      props: ['songs'],
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
        },
        yAxis() {
          return d3.svg.axis()
            .scale(this.yScale)
            .orient("left")
            .tickSize(-width, 0)
            .tickValues([1, 10, 20, 30, 40, 50, 60, 70, 80, 90, 100]);
        }
      }
    }

  function tijdlozeGraph(selector, data) {
    var frame = tijdlozeGraphFrame(selector);
    var svg = frame.svg;
    var x = frame.x;
    var y = frame.y;
    var years = frame.years;

    function highlight(index) {
      d3.selectAll(".highlight")
        .classed({"notHighlighted": true, "highlighted": false});
      d3.selectAll(".highlight-" + index)
        .classed({"notHighlighted": false, "highlighted": true});
    }
    function noHighlighting(index) {
      d3.selectAll(".highlight")
        .classed({"notHighlighted": false, "highlighted": false});
    }

    function lineData(data) {
      var lineData = [];
      var active;
      for (var i in years) {
        var datum = data
          .filter(function(d) { return d.year === years[i] })
          .filter(function(d) { return d.pos <= 100 || d.pos == '?';})
          .pop();

        if (active === undefined) {
          active = datum !== undefined;
        }

        if (datum) {
          if (datum.pos == '?') {
            return lineData;
          }

          if (! active) {
            lineData.push({x: x(years[i]), y: frame.height, defined: true});
            active = true;
          }
          lineData.push({x: x(years[i]) + x.rangeBand() / 2, y: y(datum.pos), defined: true});
        } else {
          if (active) {
            lineData.push({x: x(years[i-1]) + x.rangeBand(), y: frame.height, defined: true});
            active = false;
          }
          lineData.push({x: x(years[i]) + x.rangeBand() / 2, y: y(101), defined: false});
        }
      }
      return lineData;
    }

    function createLine(data) {
      var line = d3.svg.line()
        .x(function(d) { return d.x; })
        .y(function(d) { return d.y; })
        .defined(function(d) { return d.defined; });
      return line(lineData(data));
    }

    var line = svg.selectAll(".line")
      .data(data)
      .enter()
      .append("g")
      .attr("class", function(d,i) { return "line color-" + i + " highlight highlight-" + i; })
      .on("mouseover", function(d, i) { highlight(i); })
      .on("mouseout", function(d, i) { noHighlighting(i); });

    line.append("path")
      .attr("class", "coloredPath")
      .attr("d", createLine);

    line.selectAll(".circle")
      .data(function(d) { return d.filter(function(d) { return d.pos <= 100;}); })
      .enter()
      .append("svg:circle")
      .attr("class", "circle coloredCircle")
      .attr("cx", function(d) { return x(d.year) + x.rangeBand() / 2 })
      .attr("cy", function(d) { return y(d.pos) })
      .attr("r", 3);

    d3.selectAll("tr.highlight").each(function(d, i) {
      d3.select(this)
        .on("mouseover", function() { highlight(i); })
        .on("mouseout", function() { noHighlighting(i); });
    });
  }
</script>

<style lang="less" scoped>
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
