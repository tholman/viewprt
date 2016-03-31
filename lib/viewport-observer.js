const win = typeof window !== 'undefined' && window
const rAF = win && (win.requestAnimationFrame || function (callback) { setTimeout(callback, 1000 / 60) })

function throttle (context, method) {
  let isProcessing = false
  return function () {
    if (!isProcessing) {
      rAF(function () {
        method.call(context)
        isProcessing = false
      })
      isProcessing = true
    }
  }
}

function toggleEventListeners (handler, container, add) {
  if (win) {
    const method = add ? 'addEventListener' : 'removeEventListener'
    win[method]('resize', handler)
    container[method]('scroll', handler)
  }
}

export default class ViewportObserver {
  constructor (opts = {}) {
    this.container = opts.container || win
    this.offset = ~~opts.offset || 0
    this.isObserving = false
    this.throttledProcess = throttle(this, this.process)
  }

  start () {
    if (!this.isObserving) {
      toggleEventListeners(this.throttledProcess, this.container, true)
      this.isObserving = true
    }
    return this
  }

  stop () {
    if (this.isObserving) {
      toggleEventListeners(this.throttledProcess, this.container)
      this.isObserving = false
    }
  }

  process () { /* Logic here */ }
}
