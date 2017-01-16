/**
 * @class `Viewport`
 * A a scrollable container containing multiple observers
 * that are checked each time the viewport is manipulated (scrolled, resized, mutated)
 */
function Viewport (container) {
  this.container = container
  this.observers = []
  const element = this.element = container === document.body ? window : container

  let scheduled = false
  const throttle = window.requestAnimationFrame || ((callback) => setTimeout(callback, 1000 / 60))
  const handler = this.handler = () => {
    if (!scheduled) {
      scheduled = true
      throttle(() => {
        this.checkObservers()
        scheduled = false
      })
    }
  }

  element.addEventListener('scroll', handler)
  element.addEventListener('resize', handler)
  if (window.MutationObserver) {
    const mutationObserver = this.mutationObserver = new MutationObserver(handler)
    mutationObserver.observe(container, { attributes: true, childList: true, subtree: true })
  }
}

Viewport.prototype = {
  addObserver (observer) {
    const { observers } = this
    observers.indexOf(observer) === -1 && observers.push(observer)
  },
  removeObserver (observer) {
    const { observers } = this
    const index = observers.indexOf(observer)
    index > -1 && observers.splice(index, 1)
  },
  checkObservers () {
    const { observers, element } = this
    const isWindow = element === window
    const viewportHeight = isWindow ? element.innerHeight : element.offsetHeight
    const viewportWidth = isWindow ? element.innerWidth : element.offsetWidth
    const viewportYPos = isWindow ? element.pageYOffset : element.scrollTop

    for (let i = observers.length; i--;) {
      observers[i].check(viewportHeight, viewportWidth, viewportYPos)
    }
  },
  destroy () {
    const { element, handler, mutationObserver } = this
    element.removeEventListener('scroll', handler)
    element.removeEventListener('resize', handler)
    mutationObserver && mutationObserver.disconnect()
  }
}

export default Viewport
