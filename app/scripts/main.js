/*global $,Embers,JS*/
'use strict';

/*---------------------------------------------------------------------------*\
 * Globals
\*---------------------------------------------------------------------------*/
window.CAMPFIRE_SCROLL_RATIO = 1 / 1.61;

/*---------------------------------------------------------------------------*\
 * Scroll-to-bottom
\*---------------------------------------------------------------------------*/
var setScrollPosition = function () {
    window.setTimeout(function (){
      $('html, body').scrollTop( $(document).height() );
    }, 10);
    $('body').css('animation-play-state', 'running');
};

$('html, body').scrollTop( $(document).height() );
$(window).load(setScrollPosition);

$('body').on('animationend', function() {
  $(this).css('opacity', 1);
});

$(document).scroll(function () {
  var divScrollUp = $('.scroll-up');

  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    divScrollUp.addClass('scroll-up-show');
  }
  else {
    divScrollUp.removeClass('scroll-up-show');
  }
});

/*---------------------------------------------------------------------------*\
 * Canvas Overlay
\*---------------------------------------------------------------------------*/
var canvas = document.getElementById('embers');

window.emberOptions = {
  sparkCount: 100,
  maxSparkSize: 2.5,
  minSparkSize: 1.0,
  maxSparkVelocity: 120,
  minSparkVelocity: 50,
  maxSparkLife: 25,
  maxTailLength: 19,
  sparkSource: {
    target: document.getElementById('campfire-video'),
    widthProp: 'clientWidth',
    heightProp: 'clientHeight',
    offset: {
      x: '50%',
      y: '60%'
    }
  },
  scrollRatio: window.CAMPFIRE_SCROLL_RATIO
};

var renderer = new Jungle.GraphicRenderer(canvas, {
    canvasAutoClear: undefined,
    debug: true,
    debugPosX: 10,
    debugPosY: 70
  }, 'embers');

renderer.addChild(new Embers(window.emberOptions));

canvas = document.getElementById('stars');

renderer = new Jungle.GraphicRenderer(canvas, {
  canvasAutoClear: undefined,
  debug: true,
  debugPosX: 10,
  debugPosY: 70
}, 'stars');

renderer.addChild(new Starfield({
  starViewScrollRatio: 0.1,
  starDensity: 5,
  starViewWidth: 1920,
  starViewHeight: 9000
}));
