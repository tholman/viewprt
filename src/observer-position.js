import { Observer, ObserverInterface } from './observer-interface'

const PositionObserver = ObserverInterface(function (opts = {}) {
  this.onTop = opts.onTop
  this.onBottom = opts.onBottom
  this._wasTop = this._wasBottom = this._wasLeft = this._wasRight = true
  Observer.call(this, opts)
})

PositionObserver.prototype.check = function (viewportHeight, viewportWidth, viewportYPos) {
  const { onBottom, onTop, _wasTop, _wasBottom, container, offset, once } = this
  const atTop = viewportYPos - offset <= 0
  const atBottom = viewportHeight + viewportYPos + offset >= container.scrollHeight

  if (onBottom && !_wasBottom && atBottom) {
    onBottom.call(this, container)
    once && this.destroy()
  } else if (onTop && !_wasTop && atTop) {
    onTop.call(this, container)
    once && this.destroy()
  }

  this._wasTop = atTop
  this._wasBottom = atBottom
}

export default PositionObserver
