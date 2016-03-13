import ViewportObserver from './viewport-observer'

export default class ViewportPositionObserver extends ViewportObserver {
  constructor (opts = {}) {
    super(opts)
    this.onReachedBottom = opts.onReachedBottom
    this.onReachedTop = opts.onReachedTop
  }

  process () {
    const container = this.container
    const isWindow = container === window
    const element = isWindow ? document.body : container
    const elementHeight = isWindow ? window.innerHeight : element.offsetHeight
    const yOffset = isWindow ? window.pageYOffset : element.scrollTop

    if (this.onReachedBottom && elementHeight + yOffset + this.offset >= element.scrollHeight) {
      this.onReachedBottom(element)
    }

    if (this.onReachedTop && yOffset === 0) {
      this.onReachedTop(element)
    }
  }
}
