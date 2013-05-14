var scroller = (function(module, window, document, undefined){

  // Public options
  module.scale = 0.15; // scale elements by x
  module.check = 50; // check for containment within x pixels
  module.move = 300; // move elements by x pixels
  module.render = 5; // render every x frame



  module.setEntries = function(instances){
    setEntries(instances);
    if (entries && positions[0]) renderElements();
  };

  module.resize = function(width){
    resize(width);
    if (entries && positions[0]) renderElements();
  };








  var entries = null;;

  var windowHeight = 0;
  var positions = [];
  var widths = [];
  var heights = [];

  var elID, scrollEl, scrollElCount;

  var leftFraction, elTop, fraction;
  var renderDelay;


  var setEntries = function(instances){
    entries = instances;
    scrollElCount = entries.length;
  };



  var resize = function(containerWidth){
    windowHeight = getWindowHeight();

    for (elID = 0; elID < scrollElCount; elID++) {
      scrollEl = entries[elID];

      positions[elID] = findPos(scrollEl);

      positions[elID].leftFraction = Math.max(0, Math.min(1, positions[elID].left / containerWidth ));

      heights[elID] = scrollEl.offsetHeight;
      widths[elID] = scrollEl.offsetWidth;
    }
  };




  var init = function(){
    requestAnimationFrame(renderElements);
  };

  var renderElements = function(){
    renderDelay = module.render;
    requestAnimationFrame(delay);

    set(window.scrollY);
  };

  var delay = function(){
    requestAnimationFrame(--renderDelay == 0 ? renderElements : delay);
  };





  var set = function(scrollTop){
    for (elID = 0; elID < scrollElCount; elID++) {
      scrollEl = entries[elID];

      leftFraction = positions[elID].leftFraction;

      elTop = positions[elID].top - scrollTop - windowHeight;
      elTop = elTop - (module.check * -2.35) * leftFraction;

      fraction = (elTop + module.check) / module.check;
      fraction = Math.max(0, fraction);
      fraction = Math.min(1, fraction);

      if (fraction <= 0) {
        elTop = positions[elID].top - scrollTop + heights[elID];
        elTop = elTop + (module.check * -2.25) * leftFraction;

        fraction = (elTop - module.check) / module.check;
        fraction = Math.max(0, fraction);
        fraction = Math.min(1, fraction);

        fraction = 1 - fraction;

        scrollEl.style.opacity = 1 - fraction;
        scrollEl.style[transformStylePrefix] = 'translate(0, ' + (module.move * fraction * -1 + 'px') + ') scale('+(1 - module.scale * fraction * -1)+')';
      } else {
        scrollEl.style.opacity = 1 - fraction;
        scrollEl.style[transformStylePrefix] = 'translate(0, ' + (module.move * fraction + 'px') + ') scale('+(1 - module.scale * fraction)+')';
      }
    }
  };





  // Helper Functions

  var transformStylePrefix = (function(){
    prefix = 'transform';

    if (! (prefix in document.body.style)) {
      var v = ['ms', 'Khtml', 'O', 'Moz', 'Webkit'];

      while(v.length) {
        var prop = v.pop() + 'Transform';
        if (prop in document.body.style) {
          prefix = prop;
        }
      }
    }

    return prefix;
  })();


  var getWindowHeight = function(){
    var w = window;
    var d = document;
    var e = d.documentElement;
    var g = d.getElementsByTagName('body')[0];
    var x = w.innerWidth  || e.clientWidth  || g.clientWidth;
    var y = w.innerHeight || e.clientHeight || g.clientHeight;

    return y;
  };


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
      } while (obj.offsetParent)
    } else if (document.layers) {
      curtop += obj.y;
      curleft += obj.x;
    }

    return {top: curtop, left: curleft};
  };





  if (! window.requestAnimationFrame) {
    window.requestAnimationFrame = (function(){
      return window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function(callback){
          window.setTimeout( callback, 1000 / 60 );
        };
    })();
  }


  return module;

})({}, window, window.document);