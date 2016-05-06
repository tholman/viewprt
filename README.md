# viewprt [![Build Status](https://travis-ci.org/gdub22/viewprt.svg)](https://travis-ci.org/gdub22/viewprt)

A tiny vanilla viewport obsevation tool.  You can observe when elements enter the viewport, or when the viewport itself is scrolled to the bottom or top.  Use this as a building block to build things such as lazy image loaders, infinite scrollers, etc.

### [Demo](https://rawgit.com/gdub22/viewprt/master/demos/index.html)

### API
Elements:
```js
import { ViewportElementObserver } from 'viewprt'

var observer = new ViewportElementObserver({
  offset: 300,                          // offset in pixels from top, right, bottom, left
  onEnteredViewport: function (item) {  // callback triggered when item enters viewport
    console.log('Entered viewport!', item) 
  }
})

// Add an element to observe
var element = document.getElementById('some-element')
observer.add(element)

// Or add an arbitrary object, with an `element` property
observer.add({ foo: 'bar', element: element })

// Observation will automatically start when the first element is added and stop when there are no more elements in the queue left to enter the viewport.
// You can manually stop via `observer.stop()`
```

Position:
```js
import { ViewportPositionObserver } from 'viewprt'

var observer = new ViewportPositionObserver({
  container: document.getElementById('some-scrollable-element'), // defaults to `window`
  offset: 300,                    // offset in pixels from top, right, bottom, left
  onReachedBottom: function() {}, // callback triggered when item is scrolled to bottom
  onReachedTop: function() {}     // callback triggered when item is scrolled to top
});

observer.start() // start observing
observer.stop()  // stop observing
```


## Build
```shell
npm run build
```

## Test
```shell
npm test
```
