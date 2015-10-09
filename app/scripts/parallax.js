/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 200 pixels each
\*------------------------------------------------------------------------------------*/
var pixelsPerSection  = 200;
var sectionCount = 7;
var screenHeight = pixelsPerSection * sectionCount;

var ANIMATION_SPEED = 1.2;

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

function addEnterLeaveTransition(scene, element, top) {
  scene.on('enter', function (event) {
    console.log(event);
    TweenLite.to(element, ANIMATION_SPEED, {
        top: top,
        opacity: 1,
        overwrite: 'concurrent',
        ease: Power3.easeInOut
      });
    console.log('Enter: ' + element)
  });

  scene.on('leave', function (event) {
    TweenLite.to(element, ANIMATION_SPEED, {
        top: event.scrollDirection == 'REVERSE' ? '200%' : '-200%',
        opacity: 0,
        overwrite: 'concurrent',
        ease: Power3.easeInOut
      });
    console.log('Leave: '  + element)
  });
}

$(window).scroll(function () {
  emberOptions.debugText = ' scroll:' + controller.scrollPos();

  $('#campfire-video').css('top', (documentHeight() - window.innerHeight - controller.scrollPos()) * window.CAMPFIRE_SCROLL_RATIO)
});

var body = document.body;
var html = document.documentElement;
function documentHeight() { 
  return Math.max( body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight )
}