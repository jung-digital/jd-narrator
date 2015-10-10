/*global $,ScrollMagic,TweenLite,Power3,Power1*/
'use strict';

/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 200 pixels each
\*------------------------------------------------------------------------------------*/
var ANIMATION_SPEED = 2;
var body = document.body;
var html = document.documentElement;

function addEnterLeaveTransition(_scene, element, top) {
  _scene.on('enter', function (event) {
    console.log(event);
    TweenLite.to(element, ANIMATION_SPEED, {
        top: top,
        opacity: 1,
        overwrite: 'concurrent',
        ease: Power3.easeInOut
      });
  });

  _scene.on('leave', function (event) {
    TweenLite.to(element, ANIMATION_SPEED, {
        top: event.scrollDirection === 'REVERSE' ? '200%' : '-200%',
        opacity: 0,
        overwrite: 'concurrent',
        ease: Power3.easeInOut
      });
  });
}

function documentHeight() {
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    triggerHook: 'onLeave'
  }
});

//-------------------------------------
// section-about
//-------------------------------------
var scene = new ScrollMagic.Scene({
  triggerElement: '#section-about-trigger',
  duration: $('#section-about-trigger').height()
});

addEnterLeaveTransition(scene, '#section-about-child', '15%');

scene.addTo(controller);

//-------------------------------------
// section-campfire
//-------------------------------------
scene = new ScrollMagic.Scene({
  triggerElement: '#section-campfire-trigger',
  duration: $('#section-campfire-trigger').height()
});

addEnterLeaveTransition(scene, '#section-campfire-child', '15%');

scene.addTo(controller);

$(window).scroll(function () {
  window.emberOptions.debugText = ' scroll:' + controller.scrollPos();

  TweenLite.to('#campfire-video', 0.5, {
    top: (documentHeight() - window.innerHeight - controller.scrollPos()) * window.CAMPFIRE_SCROLL_RATIO + (window.innerHeight - $('#campfire-video').height()),
    overwrite: 'concurrent',
    ease: Power1.easeOut
  });
  //$('#campfire-video').css('top', );
});
