import assert from 'assert'
import { ViewportObserver, ViewportPositionObserver, ViewportElementObserver } from '../dist/viewprt'

describe('Viewprt', function () {
  it('can create instances', function () {
    let obsrvr = new ViewportObserver()
    let posObsrvr = new ViewportPositionObserver()
    let elObsrvr = new ViewportElementObserver()

    assert.ok(obsrvr instanceof ViewportObserver)
    assert.ok(posObsrvr instanceof ViewportObserver)
    assert.ok(elObsrvr instanceof ViewportObserver)

    assert.ok(posObsrvr instanceof ViewportPositionObserver)
    assert.ok(elObsrvr instanceof ViewportElementObserver)
  })

  it('can set offset option', function () {
    let obsrvr = new ViewportObserver({ offset: 100 })
    assert.equal(obsrvr.offset, 100)

    obsrvr = new ViewportObserver({ offset: -100 })
    assert.equal(obsrvr.offset, -100)

    obsrvr = new ViewportObserver({ offset: '100' })
    assert.equal(obsrvr.offset, 100)

    obsrvr = new ViewportObserver({ offset: null })
    assert.equal(obsrvr.offset, 0)
  })
})
