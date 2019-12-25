export default function (to, from, savedPosition) {
  // if the returned position is falsy or an empty object,
  // will retain current scroll position.
  let position = false

  const fromParts = from.path.split('/').filter(fragment => fragment.length > 0);
  const toParts = to.path.split('/').filter(fragment => fragment.length > 0);

  const maxPathLength = Math.max(fromParts.length, toParts.length);
  const minPathLength = Math.min(fromParts.length, toParts.length);

  const equalParents = fromParts.slice(0, maxPathLength - 1).every((fromPart, i) => {
    return fromPart === toParts[i];
  });

  // not parent-child or siblings
  if (maxPathLength < 2 || (maxPathLength - minPathLength) > 1 || !equalParents) {
    // scroll to the top of the page
    position = { x: 0, y: 0 }
  } else if (to.matched.some((r) => r.components.default.options.scrollToTop)) {
    // if one of the children has scrollToTop option set to true
    position = { x: 0, y: 0 }
  }

  // savedPosition is only available for popstate navigations (back button)
  if (savedPosition) {
    position = savedPosition
  }

  return new Promise(resolve => {
    // wait for the out transition to complete (if necessary)
    window.$nuxt.$once('triggerScroll', () => {
      // coords will be used if no selector is provided,
      // or if the selector didn't match any element.
      if (to.hash && document.querySelector(to.hash)) {
        // scroll to anchor by returning the selector
        position = { selector: to.hash }
      }
      resolve(position)
    })
  })
}
