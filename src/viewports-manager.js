import Viewport from './viewport'

/**
 * When adding a new observer, the manager checks if the viewport
 * already exists so they share common event listeners.
 */
let viewports = []

export function addViewportObserver (observer) {
  const container = observer.container
  const index = getViewportIndexForContainer(container)
  let viewport

  if (index > -1) {
    viewport = viewports[index]
  } else {
    viewport = new Viewport(container)
    viewports.push(viewport)
  }

  viewport.addObserver(observer)
}

export function removeViewportObserver (observer) {
  const index = getViewportIndexForContainer(observer.container)
  const viewport = viewports[index]

  if (viewport) {
    viewport.removeObserver(observer)
    if (!viewport.observers.length) {
      viewport.destroy()
      viewports.splice(index, 1)
    }
  }
}

function getViewportIndexForContainer (container) {
  for (let i = viewports.length; i--;) {
    if (viewports[i].container === container) {
      return i
    }
  }
}

// For testing only (removed via tree-shaking):
function getViewports () { // eslint-disable-line no-unused-vars
  return viewports.slice()
}
function resetViewports () { // eslint-disable-line no-unused-vars
  viewports = []
}
