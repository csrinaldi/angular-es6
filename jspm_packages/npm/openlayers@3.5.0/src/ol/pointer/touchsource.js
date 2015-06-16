/* */ 
(function(process) {
  goog.provide('ol.pointer.TouchSource');
  goog.require('goog.array');
  goog.require('goog.object');
  goog.require('ol.pointer.EventSource');
  goog.require('ol.pointer.MouseSource');
  ol.pointer.TouchSource = function(dispatcher, mouseSource) {
    var mapping = {
      'touchstart': this.touchstart,
      'touchmove': this.touchmove,
      'touchend': this.touchend,
      'touchcancel': this.touchcancel
    };
    goog.base(this, dispatcher, mapping);
    this.pointerMap = dispatcher.pointerMap;
    this.mouseSource = mouseSource;
    this.firstTouchId_ = undefined;
    this.clickCount_ = 0;
    this.resetId_ = undefined;
  };
  goog.inherits(ol.pointer.TouchSource, ol.pointer.EventSource);
  ol.pointer.TouchSource.DEDUP_TIMEOUT = 2500;
  ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT = 200;
  ol.pointer.TouchSource.POINTER_TYPE = 'touch';
  ol.pointer.TouchSource.prototype.isPrimaryTouch_ = function(inTouch) {
    return this.firstTouchId_ === inTouch.identifier;
  };
  ol.pointer.TouchSource.prototype.setPrimaryTouch_ = function(inTouch) {
    var count = goog.object.getCount(this.pointerMap);
    if (count === 0 || (count === 1 && goog.object.containsKey(this.pointerMap, ol.pointer.MouseSource.POINTER_ID.toString()))) {
      this.firstTouchId_ = inTouch.identifier;
      this.cancelResetClickCount_();
    }
  };
  ol.pointer.TouchSource.prototype.removePrimaryPointer_ = function(inPointer) {
    if (inPointer.isPrimary) {
      this.firstTouchId_ = undefined;
      this.resetClickCount_();
    }
  };
  ol.pointer.TouchSource.prototype.resetClickCount_ = function() {
    this.resetId_ = goog.global.setTimeout(goog.bind(this.resetClickCountHandler_, this), ol.pointer.TouchSource.CLICK_COUNT_TIMEOUT);
  };
  ol.pointer.TouchSource.prototype.resetClickCountHandler_ = function() {
    this.clickCount_ = 0;
    this.resetId_ = undefined;
  };
  ol.pointer.TouchSource.prototype.cancelResetClickCount_ = function() {
    if (goog.isDef(this.resetId_)) {
      goog.global.clearTimeout(this.resetId_);
    }
  };
  ol.pointer.TouchSource.prototype.touchToPointer_ = function(browserEvent, inTouch) {
    var e = this.dispatcher.cloneEvent(browserEvent, inTouch);
    e.pointerId = inTouch.identifier + 2;
    e.bubbles = true;
    e.cancelable = true;
    e.detail = this.clickCount_;
    e.button = 0;
    e.buttons = 1;
    e.width = inTouch.webkitRadiusX || inTouch.radiusX || 0;
    e.height = inTouch.webkitRadiusY || inTouch.radiusY || 0;
    e.pressure = inTouch.webkitForce || inTouch.force || 0.5;
    e.isPrimary = this.isPrimaryTouch_(inTouch);
    e.pointerType = ol.pointer.TouchSource.POINTER_TYPE;
    e.clientX = inTouch.clientX;
    e.clientY = inTouch.clientY;
    e.screenX = inTouch.screenX;
    e.screenY = inTouch.screenY;
    return e;
  };
  ol.pointer.TouchSource.prototype.processTouches_ = function(inEvent, inFunction) {
    var touches = Array.prototype.slice.call(inEvent.getBrowserEvent().changedTouches);
    var count = touches.length;
    function preventDefault() {
      inEvent.preventDefault();
    }
    var i,
        pointer;
    for (i = 0; i < count; ++i) {
      pointer = this.touchToPointer_(inEvent, touches[i]);
      pointer.preventDefault = preventDefault;
      inFunction.call(this, inEvent, pointer);
    }
  };
  ol.pointer.TouchSource.prototype.findTouch_ = function(touchList, searchId) {
    var l = touchList.length;
    var touch;
    for (var i = 0; i < l; i++) {
      touch = touchList[i];
      if (touch.identifier === searchId) {
        return true;
      }
    }
    return false;
  };
  ol.pointer.TouchSource.prototype.vacuumTouches_ = function(inEvent) {
    var touchList = inEvent.getBrowserEvent().touches;
    var keys = goog.object.getKeys(this.pointerMap);
    var count = keys.length;
    if (count >= touchList.length) {
      var d = [];
      var i,
          key,
          value;
      for (i = 0; i < count; ++i) {
        key = keys[i];
        value = this.pointerMap[key];
        if (key != ol.pointer.MouseSource.POINTER_ID && !this.findTouch_(touchList, key - 2)) {
          d.push(value.out);
        }
      }
      for (i = 0; i < d.length; ++i) {
        this.cancelOut_(inEvent, d[i]);
      }
    }
  };
  ol.pointer.TouchSource.prototype.touchstart = function(inEvent) {
    this.vacuumTouches_(inEvent);
    this.setPrimaryTouch_(inEvent.getBrowserEvent().changedTouches[0]);
    this.dedupSynthMouse_(inEvent);
    this.clickCount_++;
    this.processTouches_(inEvent, this.overDown_);
  };
  ol.pointer.TouchSource.prototype.overDown_ = function(browserEvent, inPointer) {
    this.pointerMap[inPointer.pointerId] = {
      target: inPointer.target,
      out: inPointer,
      outTarget: inPointer.target
    };
    this.dispatcher.over(inPointer, browserEvent);
    this.dispatcher.enter(inPointer, browserEvent);
    this.dispatcher.down(inPointer, browserEvent);
  };
  ol.pointer.TouchSource.prototype.touchmove = function(inEvent) {
    inEvent.preventDefault();
    this.processTouches_(inEvent, this.moveOverOut_);
  };
  ol.pointer.TouchSource.prototype.moveOverOut_ = function(browserEvent, inPointer) {
    var event = inPointer;
    var pointer = this.pointerMap[event.pointerId];
    if (!pointer) {
      return ;
    }
    var outEvent = pointer.out;
    var outTarget = pointer.outTarget;
    this.dispatcher.move(event, browserEvent);
    if (outEvent && outTarget !== event.target) {
      outEvent.relatedTarget = event.target;
      event.relatedTarget = outTarget;
      outEvent.target = outTarget;
      if (event.target) {
        this.dispatcher.leaveOut(outEvent, browserEvent);
        this.dispatcher.enterOver(event, browserEvent);
      } else {
        event.target = outTarget;
        event.relatedTarget = null;
        this.cancelOut_(browserEvent, event);
      }
    }
    pointer.out = event;
    pointer.outTarget = event.target;
  };
  ol.pointer.TouchSource.prototype.touchend = function(inEvent) {
    this.dedupSynthMouse_(inEvent);
    this.processTouches_(inEvent, this.upOut_);
  };
  ol.pointer.TouchSource.prototype.upOut_ = function(browserEvent, inPointer) {
    this.dispatcher.up(inPointer, browserEvent);
    this.dispatcher.out(inPointer, browserEvent);
    this.dispatcher.leave(inPointer, browserEvent);
    this.cleanUpPointer_(inPointer);
  };
  ol.pointer.TouchSource.prototype.touchcancel = function(inEvent) {
    this.processTouches_(inEvent, this.cancelOut_);
  };
  ol.pointer.TouchSource.prototype.cancelOut_ = function(browserEvent, inPointer) {
    this.dispatcher.cancel(inPointer, browserEvent);
    this.dispatcher.out(inPointer, browserEvent);
    this.dispatcher.leave(inPointer, browserEvent);
    this.cleanUpPointer_(inPointer);
  };
  ol.pointer.TouchSource.prototype.cleanUpPointer_ = function(inPointer) {
    goog.object.remove(this.pointerMap, inPointer.pointerId);
    this.removePrimaryPointer_(inPointer);
  };
  ol.pointer.TouchSource.prototype.dedupSynthMouse_ = function(inEvent) {
    var lts = this.mouseSource.lastTouches;
    var t = inEvent.getBrowserEvent().changedTouches[0];
    if (this.isPrimaryTouch_(t)) {
      var lt = ([t.clientX, t.clientY]);
      lts.push(lt);
      goog.global.setTimeout(function() {
        goog.array.remove(lts, lt);
      }, ol.pointer.TouchSource.DEDUP_TIMEOUT);
    }
  };
})(require("process"));
