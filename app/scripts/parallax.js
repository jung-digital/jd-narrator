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
  _scene.on('enter', function () {
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


/*-----------------------------------------------------------*\
 * Section Globals
\*-----------------------------------------------------------*/

function getTopPercent(mobile, desktop) {
  if ($(window).width() < 785) {
    if (mobile) {
      return mobile;
    }    
    return '5%';
  }
  else {
    if (desktop) {
      return desktop;
    }
    return '15%';
  }
}

//-------------------------------------
// section-contact
//-------------------------------------
var sceneContact = new ScrollMagic.Scene({
  triggerElement: '#section-contact-trigger',
  duration: $('#section-contact-trigger').height()
});

addEnterLeaveTransition(sceneContact, '#section-contact-child', getTopPercent());

sceneContact.addTo(controller);

//-------------------------------------
// section-story-type
//-------------------------------------
var sceneStoryType = new ScrollMagic.Scene({
  triggerElement: '#section-story-type-trigger',
  duration: $('#section-story-type-trigger').height()
});

addEnterLeaveTransition(sceneStoryType, '#section-story-type-child', getTopPercent());

sceneStoryType.addTo(controller);

//-------------------------------------
// section-workshop
//-------------------------------------
var sceneWorkshop = new ScrollMagic.Scene({
  triggerElement: '#section-workshop-trigger',
  duration: $('#section-workshop-trigger').height()
});

addEnterLeaveTransition(sceneWorkshop, '#section-workshop-child', getTopPercent());

sceneWorkshop.addTo(controller);

//-------------------------------------
// section-work
//-------------------------------------
var sceneWork = new ScrollMagic.Scene({
  triggerElement: '#section-work-trigger',
  duration: $('#section-work-trigger').height()
});

addEnterLeaveTransition(sceneWork, '#section-work-child', getTopPercent('', '10%'));

sceneWork.addTo(controller);

//-------------------------------------
// section-approach
//-------------------------------------
var sceneApproach = new ScrollMagic.Scene({
  triggerElement: '#section-approach-trigger',
  duration: $('#section-approach-trigger').height()
});

addEnterLeaveTransition(sceneApproach, '#section-approach-child', getTopPercent('0%', ''));

sceneApproach.addTo(controller);

//-------------------------------------
// section-about
//-------------------------------------
var sceneAbout = new ScrollMagic.Scene({
  triggerElement: '#section-about-trigger',
  duration: $('#section-about-trigger').height()
});

addEnterLeaveTransition(sceneAbout, '#section-about-child', getTopPercent());

sceneAbout.addTo(controller);

//-------------------------------------
// section-campfire
//-------------------------------------
var sceneCampfire = new ScrollMagic.Scene({
  triggerElement: '#section-campfire-trigger',
  duration: $('#section-campfire-trigger').height()
});

addEnterLeaveTransition(sceneCampfire, '#section-campfire-child', getTopPercent());

sceneCampfire.addTo(controller);

$(window).scroll(function () {
  window.emberOptions.debugText = ' scroll:' + controller.scrollPos();

  TweenLite.to('#campfire-video', 1, {
    top: (documentHeight() - window.innerHeight - controller.scrollPos()) * window.CAMPFIRE_SCROLL_RATIO + (window.innerHeight - $('#campfire-video').height()),
    overwrite: 'concurrent',
    ease: Power1.easeOut
  });
  TweenLite.to('#mountains-image', 1, {
    top: (documentHeight() - window.innerHeight - controller.scrollPos()) * window.CAMPFIRE_SCROLL_RATIO + (window.innerHeight - $('#mountains-image').height()),
    overwrite: 'concurrent',
    ease: Power1.easeOut
  });
});
