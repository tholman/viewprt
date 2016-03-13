import ViewportObserver from './viewport-observer'

function isElementInViewport (element, offset = 0, viewportWidth = window.innerWidth, viewportHeight = window.innerHeight) {
  if (element) {
    const rect = element.getBoundingClientRect()
    return rect.bottom > 0 - offset &&
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

  addElement (element) {
    if (isElementInViewport(element, this.offset)) {
      this.onEnteredViewport(element)
    } else {
      const id = '' + this._guid++
      this._queue[id] = element
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
    let id, element

    for (id in queue) {
      if (queue.hasOwnProperty(id)) {
        element = queue[id]
        if (isElementInViewport(element, this.offset, viewportWidth, viewportHeight)) {
          this.onEnteredViewport(element)
          this.removeById(id)
        }
      }
    }
  }
}
