export default function () {
  const fullWidth = 760
  const fullHeight = 400
  const margin = {top: 40, right: 50, bottom: 10, left: 20}

  const width = fullWidth - margin.left - margin.right;
  const height = fullHeight - margin.top - margin.bottom;

  return {fullWidth, fullHeight, width, height, margin}
}
