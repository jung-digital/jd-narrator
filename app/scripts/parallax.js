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

var tween = TweenMax.to('#section-campfire-child', 0.7, {
    top: '50%',
    opacity: 1
  });

var scene = new ScrollMagic.Scene({
  triggerElement: '#section-campfire'
});

scene.setTween(tween);
scene.addTo(controller);

// create scene for every slide
// for (var i = 0; i < slides.length; i++) {
//   new ScrollMagic.Scene({
//       triggerElement: slides[i]
//     })
//     .setTween('')
//     .addTo(controller);
// }


$(window).scroll(function () {
  emberOptions.debugText = ' scroll:' + controller.scrollPos();
});