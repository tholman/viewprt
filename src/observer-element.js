import { Observer, ObserverInterface } from './observer-interface'

function isElementInViewport (element, offset, viewportHeight, viewportWidth) {
  const rect = element.getBoundingClientRect()
  return !!(rect.width && rect.height) &&
         rect.top < viewportHeight + offset &&
         rect.bottom > 0 - offset &&
         rect.left < viewportWidth + offset &&
         rect.right > 0 - offset
}

const ElementObserver = ObserverInterface(function ElementObserver (element, opts = {}) {
  if (!(this instanceof ElementObserver)) {
    return new ElementObserver(...arguments)
  }

  this.element = element
  this.onEnter = opts.onEnter
  this.onExit = opts.onExit
  this._didEnter = false
  Observer.call(this, opts)
})

ElementObserver.prototype.check = function (viewportHeight, viewportWidth) {
  const { onEnter, onExit, element, offset, once, _didEnter } = this

  if (!element || !element.parentNode) {
    this.destroy()
  } else if (onEnter && !_didEnter && isElementInViewport(element, offset, viewportHeight, viewportWidth)) {
    this._didEnter = true
    onEnter.call(this, element)
    once && this.destroy()
  } else if (onExit && _didEnter && !isElementInViewport(element, offset, viewportHeight, viewportWidth)) {
    this._didEnter = false
    onExit.call(this, element)
    once && this.destroy()
  }
}

export default ElementObserver
