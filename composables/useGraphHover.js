
import {bisect} from "d3-array";

export const useGraphHover = (xScale, yScale, years) => {
  const {width, height, margin} = useGraphConstants()

  const hoverYear = ref(undefined)
  const hoverPosition = ref(undefined)
  const overlayScreenWidth = ref(undefined)
  const overlayScreenHeight = ref(undefined)

  const hoverLineX = computed(() => {
    if (hoverYear.value) {
      return xScale.value(hoverYear.value._yy);
    } else {
      return xScale.value.range()[1];
    }
  })

  const tooltipStyle = computed(() => {
    if (!!hoverYear.value && !!hoverPosition.value && !!overlayScreenWidth.value && !!overlayScreenHeight.value) {
      const tooltipTop = (margin.top + yScale.value(hoverPosition.value));
      const tooltipTopScreen = (tooltipTop * overlayScreenHeight.value / height) + "px";

      if (hoverLineX.value > width - 200) {
        const tooltipRight = (margin.right + width - hoverLineX.value + xScale.value.step() * 4/5);
        const tooltipRightScreen = (tooltipRight * overlayScreenWidth.value / width) + "px";
        return {right: tooltipRightScreen, top: tooltipTopScreen};
      } else {
        const tooltipLeft = (margin.left + hoverLineX.value + xScale.value.step() * 2/3);
        const tooltipLeftScreen = (tooltipLeft * overlayScreenWidth.value / width) + "px";
        return {left: tooltipLeftScreen, top: tooltipTopScreen};
      }
    } else {
      return {};
    }
  })

  function onHover(event) {
    let offsetX;
    let offsetY;
    let boundingClientRect;

    if (event.offsetX) {
      // mouse event
      boundingClientRect = event.target.getBoundingClientRect();
      offsetX = event.offsetX;
      offsetY = event.offsetY;
    } else if (event.touches) {
      // touch event
      boundingClientRect = event.touches[0].target.getBoundingClientRect();
      offsetX = event.touches[0].pageX - boundingClientRect.x;
      offsetY = event.touches[0].pageY - boundingClientRect.y;
    } else {
      return;
    }

    overlayScreenWidth.value = boundingClientRect.width;
    overlayScreenHeight.value = boundingClientRect.height;

    const starts = years.value.map(year => xScale.value(year._yy) - xScale.value.step() / 2);
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


