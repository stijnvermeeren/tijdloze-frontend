
import {bisect} from "d3-array";
import type {ScaleBand} from "d3-scale";
import type {ScaleLinear} from "d3-scale";
import type {ComputedRef} from "vue";
import type Year from '~/orm/Year'

export default function (
  xBandScale: ComputedRef<ScaleBand<string>>,
  xScale: ComputedRef<(input: string) => number>,
  yScale: ComputedRef<ScaleLinear<number, number>>,
  years: Ref<Year[]>
) {
  const {width, height, margin} = useGraphConstants()

  const hoverYear = ref<Year | undefined>(undefined)
  const hoverPosition = ref<number | undefined>(undefined)
  const overlayScreenWidth = ref<number | undefined>(undefined)
  const overlayScreenHeight = ref<number | undefined>(undefined)

  const hoverLineX = computed(() => {
    if (hoverYear.value) {
      return xScale.value(hoverYear.value._yy);
    } else {
      return undefined;
    }
  })

  const tooltipStyle = computed(() => {
    if (hoverLineX.value !== undefined && !!hoverPosition.value && !!overlayScreenWidth.value && !!overlayScreenHeight.value) {
      const tooltipTop = (margin.top + yScale.value(hoverPosition.value));
      const tooltipTopScreen = (tooltipTop * overlayScreenHeight.value / height) + "px";

      if (hoverLineX.value > width - 200) {
        const tooltipRight = (margin.right + width - hoverLineX.value + xBandScale.value.step() * 4/5);
        const tooltipRightScreen = (tooltipRight * overlayScreenWidth.value / width) + "px";
        return {right: tooltipRightScreen, top: tooltipTopScreen};
      } else {
        const tooltipLeft = (margin.left + hoverLineX.value + xBandScale.value.step() * 2/3);
        const tooltipLeftScreen = (tooltipLeft * overlayScreenWidth.value / width) + "px";
        return {left: tooltipLeftScreen, top: tooltipTopScreen};
      }
    } else {
      return {};
    }
  })

  function onHover(event: MouseEvent | TouchEvent) {
    let offsetX: number;
    let offsetY: number;
    let boundingClientRect: DOMRect;

    if ('offsetX' in event) {
      // mouse event
      const target = event.target as HTMLElement | null
      if (!target) {
        return
      }
      boundingClientRect = target.getBoundingClientRect();
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    } else if (event.touches.length > 0) {
      // touch event
      const touch = event.touches[0]
      if (!touch) {
        return
      }
      const target = touch.target as HTMLElement | null
      if (!target) {
        return
      }
      boundingClientRect = target.getBoundingClientRect();
      offsetX = touch.pageX - boundingClientRect.x;
      offsetY = touch.pageY - boundingClientRect.y;
    } else {
      return;
    }

    overlayScreenWidth.value = boundingClientRect.width;
    overlayScreenHeight.value = boundingClientRect.height;
    if (!overlayScreenWidth.value || !overlayScreenHeight.value) {
      return
    }

    const starts = years.value.map((year: Year) => xScale.value(year._yy) - xBandScale.value.step() / 2);
    const lookup = width / overlayScreenWidth.value * offsetX - margin.left;
    const newHoverYear = years.value[bisect(starts, lookup) - 1];
    if (newHoverYear) {
      hoverYear.value = newHoverYear;
    }

    const positionLookup = height / overlayScreenHeight.value * offsetY - margin.top;
    const newHoverPosition = Math.round(yScale.value.invert(positionLookup));
    if (newHoverPosition) {
      hoverPosition.value = newHoverPosition;
    }
  }

  return {onHover, hoverYear, hoverLineX, hoverPosition, tooltipStyle}
}
