import ViewportObserver from './viewport-observer'

function isElementInViewport (element, offset = 0, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight) {
  if (element) {
    const rect = element.getBoundingClientRect()
    return !!(rect.width && rect.height) &&
           rect.bottom > 0 - offset &&
           rect.right > 0 - offset &&
           rect.left < viewportWidth + offset &&
           rect.top < viewportHeight + offset
  }
  return false
}

export default class ViewportElementObserver extends ViewportObserver {
  constructor (opts = {}) {
    super(opts)
    this.onEnteredViewport = opts.onEnteredViewport
    this._guid = 0
    this._queue = {}
  }

  add (item) {
    const element = (item && item.element) || item
    if (!(element instanceof Element)) {
      throw new Error('Add an `Element` or object with an `element` property')
    }

    if (isElementInViewport(element, this.offset)) {
      this.onEnteredViewport(item)
    } else {
      const id = '' + this._guid++
      this._queue[id] = item
      this.start()
      return id
    }
  }

  removeById (id) {
    const queue = this._queue
    if (queue[id]) {
      delete queue[id]
      if (!--this._guid) {
        this.stop()
      }
    }
  }

  process () {
    const queue = this._queue
    const viewportWidth = window.innerWidth
    const viewportHeight = window.innerHeight
    let id, item, element

    for (id in queue) {
      if (queue.hasOwnProperty(id)) {
        item = queue[id]
        element = item.element || item
        if (isElementInViewport(element, this.offset, viewportWidth, viewportHeight)) {
          this.onEnteredViewport(item)
          this.removeById(id)
        }
      }
    }
  }
}
