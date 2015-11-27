/*global Embers,Jungle,Starfield,$*/
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

window.emberRenderer.addChild(new Embers(window.emberOptions));

/*---------------------------------------------------------------------------*\
 * Ember Canvas Underlay
\*---------------------------------------------------------------------------*/
canvas = document.getElementById('stars');

window.starRenderer = new Jungle.GraphicRenderer(canvas, {
  canvasAutoClear: true,
  debugPosX: 10,
  debugPosY: 100,
  resizeToCanvas: true
}, 'stars');

window.starRenderer.addChild(new Starfield({
  starViewScrollRatio: 0.1,
  starDensity: 3,
  starViewWidth: 2560,
  starViewHeight: 9000
}));

/*---------------------------------------------------------------------------*\
 * Video defaults
\*---------------------------------------------------------------------------*/
var campfireVideo = $('#campfire-video');
if (campfireVideo) {
  campfireVideo[0].volume = 0.2;
}

window.starRenderer.document.addListener(Jungle.events.DocumentEvents.FOCUS_CHANGE, function (event) {
  if (campfireVideo.length) {
    if (event.properties.focus) {
      campfireVideo[0].play();
    } else {
      campfireVideo[0].pause();
    }
  }
});
