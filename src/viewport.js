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
    const { observers } = this
    const state = this.getState()
    for (let i = observers.length; i--;) {
      observers[i].check(state)
    }
  },
  getState () {
    const { element } = this
    const isWindow = element === window
    return {
      w: isWindow ? element.innerWidth : element.offsetWidth,
      h: isWindow ? element.innerHeight : element.offsetHeight,
      y: isWindow ? element.pageYOffset : element.scrollTop
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
