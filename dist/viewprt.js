(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? factory(exports) :
  typeof define === 'function' && define.amd ? define(['exports'], factory) :
  (factory((global.Viewprt = global.Viewprt || {})));
}(this, function (exports) { 'use strict';

  var babelHelpers = {};

  babelHelpers.classCallCheck = function (instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  };

  babelHelpers.inherits = function (subClass, superClass) {
    if (typeof superClass !== "function" && superClass !== null) {
      throw new TypeError("Super expression must either be null or a function, not " + typeof superClass);
    }

    subClass.prototype = Object.create(superClass && superClass.prototype, {
      constructor: {
        value: subClass,
        enumerable: false,
        writable: true,
        configurable: true
      }
    });
    if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass;
  };

  babelHelpers.possibleConstructorReturn = function (self, call) {
    if (!self) {
      throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
    }

    return call && (typeof call === "object" || typeof call === "function") ? call : self;
  };

  babelHelpers;

  var win = typeof window !== 'undefined' && window;
  var rAF = win && (requestAnimationFrame || function (callback) {
    setTimeout(callback, 1000 / 60);
  });

  function throttle(context, method) {
    var isProcessing = false;
    return function () {
      if (!isProcessing) {
        rAF(function () {
          method.call(context);
          isProcessing = false;
        });
        isProcessing = true;
      }
    };
  }

  function toggleEventListeners(handler, container, add) {
    if (win) {
      var method = add ? 'addEventListener' : 'removeEventListener';
      win[method]('resize', handler);
      container[method]('scroll', handler);
    }
  }

  var ViewportObserver = function () {
    function ViewportObserver() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      babelHelpers.classCallCheck(this, ViewportObserver);

      this.container = opts.container || win;
      this.offset = ~ ~opts.offset || 0;
      this.isObserving = false;
      this.throttledProcess = throttle(this, this.process);
    }

    ViewportObserver.prototype.start = function start() {
      if (!this.isObserving) {
        toggleEventListeners(this.throttledProcess, this.container, true);
        this.isObserving = true;
      }
      return this;
    };

    ViewportObserver.prototype.stop = function stop() {
      if (this.isObserving) {
        toggleEventListeners(this.throttledProcess, this.container);
        this.isObserving = false;
      }
    };

    ViewportObserver.prototype.process = function process() {/* Logic here */};

    return ViewportObserver;
  }();

  function isElementInViewport(element) {
    var offset = arguments.length <= 1 || arguments[1] === undefined ? 0 : arguments[1];
    var viewportWidth = arguments.length <= 2 || arguments[2] === undefined ? window.innerWidth : arguments[2];
    var viewportHeight = arguments.length <= 3 || arguments[3] === undefined ? window.innerHeight : arguments[3];

    if (element) {
      var rect = element.getBoundingClientRect();
      return rect.bottom > 0 - offset && rect.right > 0 - offset && rect.left < viewportWidth + offset && rect.top < viewportHeight + offset;
    }
    return false;
  }

  var ViewportElementObserver = function (_ViewportObserver) {
    babelHelpers.inherits(ViewportElementObserver, _ViewportObserver);

    function ViewportElementObserver() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      babelHelpers.classCallCheck(this, ViewportElementObserver);

      var _this = babelHelpers.possibleConstructorReturn(this, _ViewportObserver.call(this, opts));

      _this.onEnteredViewport = opts.onEnteredViewport;
      _this._guid = 0;
      _this._queue = {};
      return _this;
    }

    ViewportElementObserver.prototype.addElement = function addElement(element) {
      if (isElementInViewport(element, this.offset)) {
        this.onEnteredViewport(element);
      } else {
        var id = '' + this._guid++;
        this._queue[id] = element;
        this.start();
        return id;
      }
    };

    ViewportElementObserver.prototype.removeById = function removeById(id) {
      var queue = this._queue;
      if (queue[id]) {
        delete queue[id];
        if (! --this._guid) {
          this.stop();
        }
      }
    };

    ViewportElementObserver.prototype.process = function process() {
      var queue = this._queue;
      var viewportWidth = window.innerWidth;
      var viewportHeight = window.innerHeight;
      var id = void 0,
          element = void 0;

      for (id in queue) {
        if (queue.hasOwnProperty(id)) {
          element = queue[id];
          if (isElementInViewport(element, this.offset, viewportWidth, viewportHeight)) {
            this.onEnteredViewport(element);
            this.removeById(id);
          }
        }
      }
    };

    return ViewportElementObserver;
  }(ViewportObserver);

  var ViewportPositionObserver = function (_ViewportObserver) {
    babelHelpers.inherits(ViewportPositionObserver, _ViewportObserver);

    function ViewportPositionObserver() {
      var opts = arguments.length <= 0 || arguments[0] === undefined ? {} : arguments[0];
      babelHelpers.classCallCheck(this, ViewportPositionObserver);

      var _this = babelHelpers.possibleConstructorReturn(this, _ViewportObserver.call(this, opts));

      _this.onReachedBottom = opts.onReachedBottom;
      _this.onReachedTop = opts.onReachedTop;
      return _this;
    }

    ViewportPositionObserver.prototype.process = function process() {
      var container = this.container;
      var isWindow = container === window;
      var element = isWindow ? document.body : container;
      var elementHeight = isWindow ? window.innerHeight : element.offsetHeight;
      var yOffset = isWindow ? window.pageYOffset : element.scrollTop;

      if (this.onReachedBottom && elementHeight + yOffset + this.offset >= element.scrollHeight) {
        this.onReachedBottom(element);
      }

      if (this.onReachedTop && yOffset === 0) {
        this.onReachedTop(element);
      }
    };

    return ViewportPositionObserver;
  }(ViewportObserver);

  exports.ViewportObserver = ViewportObserver;
  exports.ViewportElementObserver = ViewportElementObserver;
  exports.ViewportPositionObserver = ViewportPositionObserver;

}));