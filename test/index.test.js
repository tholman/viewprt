import test from 'ava'
import { ViewportObserver, ViewportPositionObserver, ViewportElementObserver } from '../dist/viewprt'

test('can create instances', assert => {
  const obsrvr = new ViewportObserver()
  const posObsrvr = new ViewportPositionObserver()
  const elObsrvr = new ViewportElementObserver()

  assert.true(obsrvr instanceof ViewportObserver)
  assert.true(posObsrvr instanceof ViewportObserver)
  assert.true(elObsrvr instanceof ViewportObserver)
  assert.true(posObsrvr instanceof ViewportPositionObserver)
  assert.true(elObsrvr instanceof ViewportElementObserver)
})

test('returns instance when calling start()', assert => {
  const obsrvr = new ViewportObserver().start()
  assert.true(obsrvr instanceof ViewportObserver)
})

test('can set offset option', assert => {
  let obsrvr = new ViewportObserver({ offset: 100 })
  assert.is(obsrvr.offset, 100)

  obsrvr = new ViewportObserver({ offset: -100 })
  assert.is(obsrvr.offset, -100)

  obsrvr = new ViewportObserver({ offset: '100' })
  assert.is(obsrvr.offset, 100)

  obsrvr = new ViewportObserver({ offset: null })
  assert.is(obsrvr.offset, 0)
})

test('defaults to window if no container option provided', assert => {
  const obsrvr = new ViewportObserver()
  assert.is(obsrvr.container, window)
})

test('can add element to queue directly or with metadata', assert => {
  const obsrvr = new ViewportElementObserver()
  const element = document.createElement('div')
  obsrvr.add(element)
  assert.is(Object.keys(obsrvr._queue).length, 1)

  obsrvr.add({ foo: 'bar', element: element })
  assert.is(Object.keys(obsrvr._queue).length, 2)

  assert.throws(() => obsrvr.add({ foo: 'bar' }))
})

test('auto start/stop observing based on having elements in queue', assert => {
  const obsrvr = new ViewportElementObserver()
  const id1 = obsrvr.add(document.createElement('div'))
  assert.is(obsrvr.isObserving, true)

  obsrvr.removeById(id1)
  assert.is(obsrvr.isObserving, false)
})
