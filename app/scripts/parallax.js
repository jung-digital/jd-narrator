var controller = new ScrollMagic.Controller();

/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 200 pixels each
\*------------------------------------------------------------------------------------*/
var pixelsPerSection  = 200;
var sectionCount = 7;
var screenHeight = pixelsPerSection * sectionCount;

// create a scene
var scene = new ScrollMagic.Scene({
        duration: 200,    // the scene should last for a scroll distance of 100px
        offset: 50        // start this scene after scrolling for 50px
    })
    .setPin("#my-sticky-element") // pins the element for the the scene's duration
    .addTo(controller); // assign the scene to the controller


$(window).scroll(function () {
  emberOptions.debugText = ' scroll:' + controller.scrollPos();
});