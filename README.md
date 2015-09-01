Fancy-Scroll
==============
for that fancy scrolling effect you were always looking for.<br>
Works pretty well with any layout you want.<br>
The example just includes a basic setup for the sake of simplicity.

<a href="http://lab.fabianirsara.com/fancy-scroll">Example</a>

#Setup
### HTML:

    <div id="wrapper-outer">
      <div id="wrapper">
        <div class="item">
          <div class="inner">
        </div>
      </div>
    </div>

### CSS:

    .item {
      transition: all 300ms ease;
    }

### JS:

    var scroller = new FancyScroll();

    scroller.scale = 0.1;
    scroller.check = 50;
    scroller.move = 200;
    scroller.render = 2;

    var items = document.querySelectorAll('.item');
    var containerWidth = document.getElementById('wrapper').offsetWidth;
    var containerHeight = document.getElementById('wrapper-outer').offsetHeight;

    scroller.setEntries(items);
    scroller.resize(containerWidth, containerHeight);

    scroller.destroy();

    FancyScroll.destroyAll();



####NOTE:
If your entries change while navigating just call <b>scroller.setEntries()</b> again.<br>
You might want to listen to <b>window.resize</b> and call <b>scroller.resize</b> again to re-calculate offsets