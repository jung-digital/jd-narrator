/*global $,Embers,Jungle,Starfield*/
'use strict';

/*---------------------------------------------------------------------------*\
 * Globals
\*---------------------------------------------------------------------------*/
window.CAMPFIRE_SCROLL_RATIO = 1 / 1.61;

/*---------------------------------------------------------------------------*\
 * Ember Canvas Overlay
\*---------------------------------------------------------------------------*/
var canvas = document.getElementById('embers');

window.emberOptions = {
  sparkCount: 60,
  maxSparkSize: 2.5,
  minSparkSize: 1.0,
  maxSparkVelocity: 120,
  minSparkVelocity: 50,
  maxSparkLife: 25,
  maxTailLength: 18,
  sparkSource: {
    target: document.getElementById('campfire-video'),
    widthProp: 'clientWidth',
    heightProp: 'clientHeight',
    offset: {
      x: '50%',
      y: '45%'
    }
  },
  scrollRatio: window.CAMPFIRE_SCROLL_RATIO
};

window.emberRenderer = new Jungle.GraphicRenderer(canvas, {
    canvasAutoClear: true,
    //debug: true,
    debugPosX: 500,
    debugPosY: 100,
    resizeToCanvas: true
  }, 'embers');

emberRenderer.addChild(new Embers(window.emberOptions));

/*---------------------------------------------------------------------------*\
 * Ember Canvas Underlay
 \*---------------------------------------------------------------------------*/
canvas = document.getElementById('stars');

window.starRenderer = new Jungle.GraphicRenderer(canvas, {
  canvasAutoClear: true,
  //debug: true,
  debugPosX: 10,
  debugPosY: 100,
  resizeToCanvas: true
}, 'stars');

starRenderer.addChild(new Starfield({
  starViewScrollRatio: 0.1,
  starDensity: 2,
  starViewWidth: 1920,
  starViewHeight: 9000
}));
