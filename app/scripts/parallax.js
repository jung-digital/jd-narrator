/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 200 pixels each
\*------------------------------------------------------------------------------------*/
var pixelsPerSection  = 200;
var sectionCount = 7;
var screenHeight = pixelsPerSection * sectionCount;

var controller = new ScrollMagic.Controller({
  globalSceneOptions: {
    triggerHook: 'onLeave'
  }
});

// get all slides
var slides = document.querySelectorAll(".section");

var tl = new TimelineMax()
  .add([
      TweenMax.fromTo('#section-campfire-child', 0.7, {
        top: '200%',
        opacity: 0
      }, {
        top: '50%',
        opacity: 1
      })
    ]);

var scene = new ScrollMagic.Scene({
  triggerElement: '#section-campfire'
});

scene.setTween(tl);
scene.addTo(controller);

$(window).scroll(function () {
  emberOptions.debugText = ' scroll:' + controller.scrollPos();
});