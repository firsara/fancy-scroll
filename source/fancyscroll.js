;(function () {
  'use strict';

  // private static helpers
  var elID, scrollEl;

  var leftFraction, elTop, fraction;
  var _scrollers = [];

  function FancyScroll(){
    // Public options
    this.scale = 0.15; // scale elements by x
    this.check = 50; // check for containment within x pixels
    this.move = 300; // move elements by x pixels
    this.render = 5; // render every x frame
    this.force3D = false;

    this._entries = null;
    this._positions = [];
    this._widths = [];
    this._heights = [];

    this._containerWidth = 0;
    this._containerHeight = 0;
    this._scrollElCount = 0;

    this._renderDelay = 1;
    this._isRendering = true;

    this.__bound_delay = this._delay.bind(this);
    this.__bound_renderElements = this._renderElements.bind(this);

    _scrollers.push(this);
  }

  FancyScroll.destroyAll = function(){
    while (_scrollers.length > 0) _scrollers[0].destroy();
  };


  FancyScroll.prototype.setEntries = function(instances){
    this._setEntries(instances);
    if (this._entries && this._positions[0]) this.__bound_renderElements();
  };

  FancyScroll.prototype.resize = function(width, height){
    this._resize(width, height);
    if (this._entries && this._positions[0]) this.__bound_renderElements();
  };

  FancyScroll.prototype.destroy = function(){
    this._isRendering = false;
    if (this._delayTimeout) cancelAnimationFrame(this._delayTimeout);
    if (this._renderTimeout) cancelAnimationFrame(this._renderTimeout);

    for (var i = 0, _len = _scrollers.length; i < _len; i++) {
      if (_scrollers[i] === this) {
        _scrollers.splice(i, 1);
        break;
      }
    }
  };








  FancyScroll.prototype._setEntries = function(instances){
    this._entries = instances;
    this._scrollElCount = this._entries.length;
  };



  FancyScroll.prototype._resize = function(containerWidth, containerHeight){
    this._containerWidth = containerWidth;
    this._containerHeight = containerHeight;

    for (elID = 0; elID < this._scrollElCount; elID++) {
      scrollEl = this._entries[elID];

      this._positions[elID] = findPos(scrollEl);

      this._positions[elID].leftFraction = Math.max(0, Math.min(1, this._positions[elID].left / this._containerWidth ));

      this._heights[elID] = scrollEl.offsetHeight;
      this._widths[elID] = scrollEl.offsetWidth;
    }
  };





  FancyScroll.prototype._renderElements = function(){
    if (! this._isRendering) return;

    this._renderDelay = this.render;
    this._delayTimeout = requestAnimationFrame(this.__bound_delay);

    this._set(window.scrollY);
  };

  FancyScroll.prototype._delay = function(){
    if (! this._isRendering) return;
    this._renderTimeout = requestAnimationFrame(--this._renderDelay === 0 ? this.__bound_renderElements : this.__bound_delay);
  };





  FancyScroll.prototype._set = function(scrollTop){
    for (elID = 0; elID < this._scrollElCount; elID++) {
      scrollEl = this._entries[elID];

      leftFraction = this._positions[elID].leftFraction;

      elTop = this._positions[elID].top - scrollTop - this._containerHeight;
      elTop = elTop - (this.check * -2.35) * leftFraction;

      fraction = (elTop + this.check) / this.check;
      fraction = Math.max(0, fraction);
      fraction = Math.min(1, fraction);

      if (fraction <= 0) {
        elTop = this._positions[elID].top - scrollTop + this._heights[elID];
        elTop = elTop + (this.check * -2.25) * leftFraction;

        fraction = (elTop - this.check) / this.check;
        fraction = Math.max(0, fraction);
        fraction = Math.min(1, fraction);

        fraction = 1 - fraction;

        scrollEl.style.opacity = 1 - fraction;
        scrollEl.style[transformStylePrefix] = this.force3D
          ? 'translate(0, ' + (this.move * fraction * -1 + 'px') + ') scale('+(1 - this.scale * fraction * -1)+')'
          : 'translate3d(0, ' + (this.move * fraction * -1 + 'px') + ', 0) scale('+(1 - this.scale * fraction * -1)+')';
      } else {
        scrollEl.style.opacity = 1 - fraction;
        scrollEl.style[transformStylePrefix] = this.force3D
          ? 'translate(0, ' + (this.move * fraction + 'px') + ') scale('+(1 - this.scale * fraction)+')'
          : 'translate3d(0, ' + (this.move * fraction + 'px') + ', 0) scale('+(1 - this.scale * fraction)+')';
      }
    }
  };





  // Helper Functions

  var transformStylePrefix = 'transform';

  var checkTransformStylePrefix = function(){
    if (document.body && document.body.style) {
      var prefix = 'transform';

      if (! (prefix in document.body.style)) {
        var v = ['ms', 'Khtml', 'O', 'Moz', 'Webkit'];

        while(v.length) {
          var prop = v.pop() + 'Transform';
          if (prop in document.body.style) {
            prefix = prop;
          }
        }
      }

      transformStylePrefix = prefix;
    } else {
      setTimeout(checkTransformStylePrefix, 17);
    }
  };

  checkTransformStylePrefix();

  var findPos = function(obj){
    var obj2 = obj;
    var curtop = 0;
    var curleft = 0;
    if (document.getElementById || document.all) {
      do {
        curleft += obj.offsetLeft - obj.scrollLeft;
        curtop += obj.offsetTop - obj.scrollTop;
        obj = obj.offsetParent;
        obj2 = obj2.parentNode;
        while (obj2 != obj) {
          curleft -= obj2.scrollLeft;
          curtop -= obj2.scrollTop;
          obj2 = obj2.parentNode;
        }
      } while (obj.offsetParent);
    } else if (document.layers) {
      curtop += obj.y;
      curleft += obj.x;
    }

    return {top: curtop, left: curleft};
  };


  if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {

    // AMD. Register as an anonymous module.
    define(function() {
      return FancyScroll;
    });
  } else if (typeof module !== 'undefined' && module.exports) {
    module.exports = FancyScroll;
    module.exports.FancyScroll = FancyScroll;
  } else {
    window.FancyScroll = FancyScroll;
  }
}());
