
import {scaleLinear, scaleBand} from "d3-scale";
import {useRootStore} from "~/stores/root";
import {useGraphConstants} from "~/composables/useGraphConstants";
import _ from "lodash";
import {line} from "d3-shape";

export const useGraph = () => {

  const {width, height} = useGraphConstants()

  const years = computed(() => {
    return useRootStore().years;
  })

  const xScale = computed(() => {
    return scaleBand()
      .rangeRound([10, width + 10])
      .paddingInner(0.1)
      .paddingOuter(0.2)
      .domain(years.value.map(year => year._yy));
  })

  const yScale = computed(() => {
    return scaleLinear()
      .range([0, height])
      .domain([0,101]);
  })

  function songLine(song, yearIntervals, suddenEnds) {
    const halfBandWith = xScale.value.bandwidth() / 2;
    const undefinedPoint = {
      x: null,
      y: null,
      defined: false
    };

    const intervalLines = yearIntervals.map(interval => {
      let start = [];
      if (!suddenEnds && _.first(interval).yyyy !== 1987) {
        start = [{
          x: xScale.value(_.first(interval)._yy) - halfBandWith,
          y: height,
          defined: true
        }];
      }

      const positions = interval
        .filter(year => song.position(year))
        .map(year => {
          return {
            x: xScale.value(year._yy),
            y: yScale.value(song.position(year)),
            defined: true
          };
        });

      const lastYear = _.last(interval);
      if (suddenEnds || lastYear.isCurrent()) {
        return _.flatten([start, positions, undefinedPoint]);
      } else {
        const end = {
          x: xScale.value(lastYear._yy) + halfBandWith,
          y: height,
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

  return {years, xScale, yScale, songLine}
}


