import {scaleLinear, scaleBand} from "d3-scale";
import {line} from "d3-shape";
import type Year from '~/orm/Year'
import type Song from '~/orm/Song'

type GraphPoint = {
  x: number
  y: number
  defined: boolean
}

export default function () {
  const {width, height} = useGraphConstants()

  const {years, currentYear} = storeToRefs(useYearStore())

  const extended = ref(false)

  const {maxPositionByYyyy} = storeToRefs(useRootStore())

  const cutoffPositionBefore = computed<Record<number, number>>(() => {
    const result: Record<number, number> = {}
    let previousYearCutoff: number | undefined = undefined
    years.value.forEach(year => {
      const thisYearCutoff = (maxPositionByYyyy.value[year.yyyy]!) + 1
      if (previousYearCutoff !== undefined) {
        result[year.yyyy] = Math.min(previousYearCutoff, thisYearCutoff);
      } else {
        result[year.yyyy] = thisYearCutoff;
      }
      previousYearCutoff = thisYearCutoff
    })
    return result
  })

  const cutoffPositionAfter = computed<Record<number, number>>(() => {
    const result: Record<number, number> = {}
    let previousYear: Year | undefined = undefined
    years.value.forEach(year => {
      const thisYearCutoff = (maxPositionByYyyy.value[year.yyyy]!) + 1
      if (previousYear) {
        result[previousYear.yyyy] = Math.min(result[previousYear.yyyy]!, thisYearCutoff);
      }
      result[year.yyyy] = thisYearCutoff;
      previousYear = year
    })
    return result
  })

  const maxPosition = computed(() => {
    return Math.max(0, ...Object.values(maxPositionByYyyy.value))
  })

  const xBandScale = computed(() => {
    return scaleBand()
      .rangeRound([0, width])
      .paddingOuter(0.2)
      .domain(years.value.map(year => year._yy));
  })

  const xScale = computed(() => {
    return (input: string): number => {
      return (xBandScale.value(input) ?? 0) + xBandScale.value.bandwidth() / 2;
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
        const y = yScale.value((maxPositionByYyyy.value[year.yyyy]!) + 1)
        const xStart = (index === 0) ? 0 : (xBandScale.value(year._yy)!)
        const xEnd = (index === years.value.length - 1) ? width : (xBandScale.value(year._yy)!) + xBandScale.value.bandwidth()
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

  function songLine(song: Song, yearIntervals: Year[][], suddenEnds = false) {
    const halfBandWith = xBandScale.value.bandwidth() / 2;
    const undefinedPoint: GraphPoint = {
      x: 0,
      y: 0,
      defined: false
    };

    const intervalLines = yearIntervals.map((interval: Year[]) => {
      const intervalYears = interval.filter(year => song.position(year, extended.value))
      const positions = intervalYears.map(year => song.position(year, extended.value))

      let start: GraphPoint[] = [];
      const firstYear = interval[0]
      if (!suddenEnds && firstYear && firstYear.yyyy !== 1987) {
        const firstPosition = positions[0] ?? 0
        const cutoffPosition = cutoffPositionBefore.value[firstYear.yyyy] ?? 0
        start = [{
          x: xScale.value(firstYear._yy) - 9 / 10 * halfBandWith,
          y: yScale.value(Math.max(firstPosition, cutoffPosition)),
          defined: true
        }];
      }

      const positionPoints: GraphPoint[] = intervalYears.map((year: Year) => {
        return {
          x: xScale.value(year._yy),
          y: yScale.value(song.position(year, extended.value)!),
          defined: true
        };
      });

      const lastYear = interval[interval.length - 1];
      if (!lastYear || suddenEnds || (currentYear.value && lastYear.equals(currentYear.value))) {
        return [start, positionPoints, undefinedPoint].flat();
      } else {
        const lastPosition = positions[positions.length - 1] ?? 0;
        const cutoffPosition = cutoffPositionAfter.value[lastYear.yyyy]!;
        const end = {
          x: xScale.value(lastYear._yy) + 9 / 10 * halfBandWith,
          y: yScale.value(Math.max(lastPosition, cutoffPosition)),
          defined: true
        };
        return [start, positionPoints, end, undefinedPoint].flat();
      }
    });

    const songLineGenerator = line<GraphPoint>()
      .x(function(d: GraphPoint) { return d.x; })
      .y(function(d: GraphPoint) { return d.y; })
      .defined(function(d: GraphPoint) { return d.defined; });
    return songLineGenerator(intervalLines.flat());
  }

  return {years, xBandScale, xScale, yScale, songLine, extended, greyBackgroundPoints}
}


