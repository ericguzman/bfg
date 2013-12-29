/**
 * @module ui/page-navigator.reel
 * @requires montage/ui/component
 */
var Component = require("montage/ui/component").Component;
var Slot = require("montage/ui/slot.reel").Slot;


/**
 * @class Welcome
 * @extends Component
 */
exports.PageNavigator = Component.specialize(/** @lends Welcome# */ {

  constructor: {
    value: function PageNavigator() {
      this.super();
    }
  },

  /**
   * @enum {number}
   */
  TransitionState: {
    value: {
      PROGRESSING: 0,
      NEXT: 1,
      STAY: 2
    }
  },

  /**
   * @enum {number}
   */
  StepDirection: {
    value: {
      UP: 0,
      RIGHT: 1,
      DOWN: 2,
      LEFT: 3
    }
  },

  _currentPage: {
    value: null
  },
  currentPage: {
    get: function() {
      return this._currentPage;
    },
    set: function(value) {
      if (value === this._currentPage) {
        return;
      }

      // TODO: Check for a cached slot for this page data.

      var initialPageSlot = this._createPageSlot();
      initialPageSlot.content = initialPage.module.create();
      this._initializeAdjacentPages(initialPage);

      this._currentPage = value;
      this._initializeAdjacentPages(value);
      this.needsDraw = true;
    }

  },


  adjacentPageSlots: {
    value: []
  },

  initialPageSlot: {
    value: null
  },
  pageData: {
    value: null,
    serializable: true
  },
  _translateComposer: {
    value: null
  },


  /**
   * @type {PageNavigator.TransitionState}
   */
  transitionProgress: {
    value: null
  },

  _translateX: {
    value: 0
  },
  translateX: {
    get: function() {
      return this._translateX;
    },
    set: function(value) {
      if (this._translateX === value) {
        return;
      }

      this._translateX = value;

      this.needsDraw = true;
    }
  },

  _startTranslateX: {
    enumerable: false,
    value: null
  },

  _translationProgress: {
    value: null
  },
  translationProgress: {
    get: function() {
      return this._translationProgress;
    },
    set: function(value) {
      if (this._translationProgress == value) {
        return;
      }

      // Dispatch event?
      console.log('Translation proress:', value);
      this._translationProgress = value;
    }
  },

  absoluteTransitionAmount: {
    value: 0
  },

  _viewWidth: {
    value: 0
  },

  _viewHeight: {
    value: 0
  },

  _needsNextStep: {
    value: false
  },

  _stepDirection: {
    value: null
  },

  handleTranslateStart: {
    value: function(e) {
      this._startTranslateX = e.translateX;
      console.log('translate start', e.translateX);
      //this._startPositionX = this.__positionX;
      //this._removeEventListeners();
      //this._valueSyncedWithPosition = false;

      this.transitionState = this.TransitionState.PROGRESSING;
    }
  },

  handleTranslate: {
    value: function (e) {
      console.log('translate', e.translateX);

      this.translateX = e.translateX;
      //this.absoluteTransitionAmount += e.translateX;

      this.translationProgress = this.translateX / this._viewWidth;
    }
  },

  handleTranslateEnd: {
    value: function(e) {
      console.log('translate end', this.translateX);
      //this._addEventListeners();

      // TODO: determine direction based on max of x,y movement
      this._stepDirection = this.StepDirection.RIGHT;

      if (this.translationProgress > 0.3) {
        this.transitionState = this.TransitionState.NEXT;


      } else {
        this.transitionState = this.TransitionState.STAY;
      }

      this.needsDraw = true;
    }
  },

  _initializeTransitionBreakpoints: {
    value: function() {
      this._viewWidth = this.element.offsetWidth;
      this._viewHeight = this.element.offsetHeight;

      console.log('view height', this._viewHeight);
      console.log('view width', this._viewWidth);

      this._initialized = true;
    }
  },

  _initializeAdjacentPages: {
    value: function(pageData) {
      var Dir = this.StepDirection;
      var dirs = [Dir.UP, Dir.RIGHT, Dir.DOWN, Dir.LEFT];

      dirs.forEach(function(dir) {
        var pageObj = pageData[dir];

        if (!pageObj) {
          return;
        }

        var slot = this._createPageSlot();
        this._positionSlot(dir, slot);
        slot.content = this._getPageModuleWithId(initialPage.left, pages).create();


      }.bind(this));
    }
  },

  _createPageSlot: {
    value: function() {
      var slot = Slot.create();
      var element = document.createElement('div');

      this.element.appendChild(element);

      slot.element = element;
      this.addChildComponent(slot);
      return slot;
    }
  },

  _getPageModuleWithId: {
    value: function(id, pages) {
      var page = pages.filter(function(pageConfig) {
        return pageConfig.id === id;
      });

      return page[0] ? page[0].module : null;
    }
  },

  _slotsToPosition: {
    value: []
  },

  _positionSlot: {
    value: function(position, slot) {
      var PositionType = this.StepDirection,
          x, y;

      switch (position) {
        case PositionType.UP:
          x = 0;
          y = -this._viewHeight;
          break;
        case PositionType.RIGHT:
          x = this._viewWidth;
          y = 0;
          break;
        case PositionType.DOWN:
          x = 0;
          y = this._viewHeight;
          break;
        case PositionType.LEFT:
          x = -this._viewWidth;
          y = 0;
          break;
        default:
          console.error('_positionSlot:: unknown position type/step direction.');
      }
    }
  },

  prepareForActivationEvents: {
    value: function() {
      this._translateComposer.addEventListener('translateStart', this, false);
      this._translateComposer.addEventListener('translate', this, false);
      this._translateComposer.addEventListener('translateEnd', this, false);
      //this._addEventListeners();
    }
  },

  enterDocument: {
    value: function() {
      var pages = this.pageData && this.pageData.pages;

      if (!pages || !pages.length) {
        return;
      }

      this.currentPage = pages[0];
    }
  },

  draw: {
    value: function() {
      var rows = this.pageData.pages;

      if (this._translateX !== null) {
        var trans = '-webkit-transition';
        var transValue = '-webkit-transform .1s ease-in';
        var endTranslation, translateStr;

        if (this.transitionState == this.TransitionState.NEXT) {
          //this.initialPageSlot.element.style[trans] = transValue;
          endTranslation = this._translateX = this._translateComposer.translateX = this._viewWidth;
          console.log('drawing translation to step');
        } else if (this.transitionState == this.TransitionState.STAY) {
          //this.initialPageSlot.element.style[trans] = transValue;
          endTranslation = this._translateX = this._translateComposer.translateX = 0;
          console.log('drawing translation to base');
        } else if (this.transitionState == this.TransitionState.PROGRESSING) {
          //this.initialPageSlot.element.style[trans] = 'none';
          endTranslation = this._translateX;
        }

        //endTranslation += this.absoluteTransitionAmount;

        translateStr = 'translate3d(' + endTranslation + 'px, 0, 0)';
        //this.initialPageSlot.element.style['-webkit-transform'] = translateStr;
      }


    }
  },

  didDraw: {
    value: function() {
      this._needsNextStep = false;

      if (!this._initialized) {
        // Initializes metrics data for positioning logic.
        this._initializeTransitionBreakpoints();
      } else {

      }

      while (this._slotsToPosition.length) {
        var slotObj = this._slotsToPosition.pop();
        var slot = slotObj.slot;
        var x = slotObj.x;
        var y = slotObj.y;

        slot.element.style['-webkit-transform'] = 'translate3d(' + x + 'px, ' + y + 'px, 0)';
      }
    }
  }
});
