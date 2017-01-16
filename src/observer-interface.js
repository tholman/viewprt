import { addViewportObserver, removeViewportObserver } from './viewports-manager'

/**
 * @interface Observer
 * Each type of observer implements these options/methods
 */
export function Observer (opts) {
  this.offset = ~~opts.offset || 0
  this.container = opts.container || document.body
  this.once = Boolean(opts.once)
  this.activate()
  this.check()
}

Observer.prototype = {
  activate () {
    addViewportObserver(this)
  },
  destroy () {
    removeViewportObserver(this)
  },
  check () {} // must implement
}

export function ObserverInterface (Subclass) {
  Subclass.prototype = Object.create(Observer.prototype)
  Subclass.prototype.constructor = Subclass
  return Subclass
}
