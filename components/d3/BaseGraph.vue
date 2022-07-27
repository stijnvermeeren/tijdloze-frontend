<script>
  import {scaleLinear, scaleBand} from "d3-scale";
  import {line} from "d3-shape";
  import _ from 'lodash';

  export default {
    data() {
      return {
        fullWidth: 760,
        fullHeight: 400,
        margin: {top: 40, right: 50, bottom: 10, left: 20}
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
          .rangeRound([10, this.width + 10])
          .paddingInner(0.1)
          .paddingOuter(0.2)
          .domain(this.years.map(year => year._yy));
      },
      yScale() {
        return scaleLinear()
          .range([0, this.height])
          .domain([0,101]);
      }
    },
    methods: {
      songLine(song, yearIntervals, suddenEnds) {
        const halfBandWith = this.xScale.bandwidth() / 2;
        const undefinedPoint = {
          x: null,
          y: null,
          defined: false
        };

        const intervalLines = yearIntervals.map(interval => {
          let start = [];
          if (!suddenEnds && _.first(interval).yyyy !== 1987) {
            start = [{
              x: this.xScale(_.first(interval)._yy) - halfBandWith,
              y: this.height,
              defined: true
            }];
          }

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
          if (suddenEnds || lastYear.isCurrent()) {
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
