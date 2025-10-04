
import {scaleLinear, scaleBand} from "d3-scale";
import {line} from "d3-shape";

export default function () {
  const {width, height} = useGraphConstants()

  const {years, currentYear} = storeToRefs(useYearStore())

  const extended = ref(false)

  const {maxPositionByYyyy} = storeToRefs(useRootStore())

  const cutoffPositionBefore = computed(() => {
    const result = {}
    let previousYearCutoff = undefined
    years.value.forEach(year => {
      const thisYearCutoff = maxPositionByYyyy.value[year.yyyy] + 1
      if (previousYearCutoff) {
        result[year.yyyy] = Math.min(previousYearCutoff, thisYearCutoff);
      } else {
        result[year.yyyy] = thisYearCutoff;
      }
      previousYearCutoff = thisYearCutoff
    })
    return result
  })

  const cutoffPositionAfter = computed(() => {
    const result = {}
    let previousYear = undefined
    years.value.forEach(year => {
      const thisYearCutoff = maxPositionByYyyy.value[year.yyyy] + 1
      if (previousYear) {
        result[previousYear.yyyy] = Math.min(result[previousYear.yyyy], thisYearCutoff);
      }
      result[year.yyyy] = thisYearCutoff;
      previousYear = year
    })
    return result
  })

  const maxPosition = computed(() => {
    return Math.max(...Object.values(maxPositionByYyyy.value))
  })

  const xBandScale = computed(() => {
    return scaleBand()
      .rangeRound([0, width])
      .paddingOuter(0.2)
      .domain(years.value.map(year => year._yy));
  })

  const xScale = computed(() => {
    return (input) => {
      return xBandScale.value(input) + xBandScale.value.bandwidth() / 2;
    }
  })

  const yScale = computed(() => {
    const maxY = extended.value ? maxPosition.value : 100;
    return scaleLinear()
      .range([0, height])
      .domain([0, maxY + 1]);
  })

  const greyBackgroundPoints = computed(() => {
    if (years.value.length) {
      const points = []
      years.value.forEach((year, index) => {
        const y = yScale.value(maxPositionByYyyy.value[year.yyyy] + 1)
        const xStart = (index === 0) ? 0 : xBandScale.value(year._yy)
        const xEnd = (index === years.value.length - 1) ? width : xBandScale.value(year._yy) + xBandScale.value.bandwidth()
        points.push(`${xStart},${y}`)
        points.push(`${xEnd},${y}`)
      })
      points.push(`${width},${yScale.value(maxPosition.value + 1)}`)
      points.push(`0,${yScale.value(maxPosition.value + 1)}`)
      return points.join(" ")
    } else {
      return ""
    }
  })

  function songLine(song, yearIntervals, suddenEnds) {
    const halfBandWith = xBandScale.value.bandwidth() / 2;
    const undefinedPoint = {
      x: null,
      y: null,
      defined: false
    };

    const intervalLines = yearIntervals.map(interval => {
      const intervalYears = interval.filter(year => song.position(year, extended.value))
      const positions = intervalYears.map(year => song.position(year, extended.value))

      let start = [];
      if (!suddenEnds && interval[0].yyyy !== 1987) {
        const firstPosition = positions[0]
        const cutoffPosition = cutoffPositionBefore.value[interval[0].yyyy]
        start = [{
          x: xScale.value(interval[0]._yy) - 9 / 10 * halfBandWith,
          y: yScale.value(Math.max(firstPosition, cutoffPosition)),
          defined: true
        }];
      }

      const positionPoints = intervalYears.map(year => {
        return {
          x: xScale.value(year._yy),
          y: yScale.value(song.position(year, extended.value)),
          defined: true
        };
      });

      const lastYear = interval[interval.length - 1];
      if (suddenEnds || lastYear.equals(currentYear.value)) {
        return [start, positionPoints, undefinedPoint].flat();
      } else {
        const lastPosition = positions[positions.length - 1];
        const cutoffPosition = cutoffPositionAfter.value[interval[interval.length - 1].yyyy];
        const end = {
          x: xScale.value(lastYear._yy) + 9 / 10 * halfBandWith,
          y: yScale.value(Math.max(lastPosition, cutoffPosition)),
          defined: true
        };
        return [start, positionPoints, end, undefinedPoint].flat();
      }
    });

    let songLine = line()
      .x(function(d) { return d.x; })
      .y(function(d) { return d.y; })
      .defined(function(d) { return d.defined; });
    return songLine(intervalLines.flat());
  }

  return {years, xBandScale, xScale, yScale, songLine, extended, greyBackgroundPoints}
}


