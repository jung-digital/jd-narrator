/*global $,ScrollMagic,TweenLite,Power1*/
'use strict';

/*---------------------------------------------------------------------------*\
 * hashchange
\*---------------------------------------------------------------------------*/
(function(window) {

  // exit if the browser implements that event
  if ( 'onhashchange' in window.document.body ) {
    return;
  }

  var location = window.location;
  var oldURL = location.href;
  var oldHash = location.hash;

  // check the location hash on a 100ms interval
  setInterval(function() {
    var newURL = location.href,
      newHash = location.hash;

    // if the hash has changed and a handler has been bound...
    if ( newHash !== oldHash && typeof window.onhashchange === 'function' ) {
      // execute the handler
      window.onhashchange({
        type: 'hashchange',
        oldURL: oldURL,
        newURL: newURL
      });

      oldURL = newURL;
      oldHash = newHash;
    }
  }, 100);
})(window);

/*---------------------------------------------------------------------------*\
 * Scaling Sections
\*---------------------------------------------------------------------------*/
var curSection;
var curSubSection;

/**
 * This function automatically scales a section based on the window's:
 *
 * - innerWidth out of 968
 * - innerHeight out of 700
 */
function sectionsScale() {
  var scaleX = window.innerWidth / 968;
  var scaleY = window.innerHeight / 700;
  var scale = Math.max(0.72, Math.min(1, Math.min(scaleX, scaleY)));
  scale = window.innerWidth < 768 ? 1 : scale;

  $('.section-child').css('transform', 'scale(' + scale + ',' + scale + ')');
}

/**
 * This function calculates a post-scaling of a section's ideal top position
 * so that it is centered in the window.
 *
 * @param section
 * @returns {string}
 */
function getSectionFocusTop(section) {
  var rect = section.getBoundingClientRect();
  var percent = ((window.innerHeight - rect.height) / 2) / window.innerHeight;
  percent = Math.max(0, percent);

  return (percent * 100) + '%';
}

/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 200 pixels each
\*------------------------------------------------------------------------------------*/
var ANIMATION_SPEED = 2;
var body = document.body;
var html = document.documentElement;

var loaded = false;
var documentScrollHandler = function() {}; // Overwritten below

function firstSceneTransition() {
  if (!loaded) {
    console.log('First scene transition!');
    loaded = true;
    documentScrollHandler(true);

    // If a subsection has already loaded we don't need to fade in the body
    if (!curSubSection) {
      $(document.body).addClass('body-fadein');
    }
  }
}

function addEnterLeaveTransition(_scene, element) {
  _scene.on('enter', function () {
    curSection = $(element).get(0);

    TweenLite.to(element, !loaded ? 0 : ANIMATION_SPEED, {
      top: getSectionFocusTop(curSection),
      opacity: 1,
      overwrite: 'concurrent',
      ease: Power1.easeOut
    });

    if (!loaded) {
      setTimeout(function () {
        firstSceneTransition();
      }, 1);
    }
  });

  _scene.on('leave', function (event) {
    TweenLite.to(element, !loaded ? 0 : ANIMATION_SPEED, {
        top: event.scrollDirection === 'REVERSE' ? '200%' : '-200%',
        opacity: 0,
        overwrite: 'concurrent',
        ease: Power1.easeInOut
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
function setupScenes() {
  //-------------------------------------
  // section-contact
  //-------------------------------------
  var sceneContact = new ScrollMagic.Scene({
    triggerElement: '#contact',
    duration: $('#contact').height()
  });

  addEnterLeaveTransition(sceneContact, '#section-contact-child');

  sceneContact.addTo(controller);

  //-------------------------------------
  // section-story-type
  //-------------------------------------
  var sceneStoryType = new ScrollMagic.Scene({
    triggerElement: '#story',
    duration: $('#story').height()
  });

  addEnterLeaveTransition(sceneStoryType, '#section-story-type-child');

  sceneStoryType.addTo(controller);

  //-------------------------------------
  // section-workshop
  //-------------------------------------
  var sceneWorkshop = new ScrollMagic.Scene({
    triggerElement: '#workshop',
    duration: $('#workshop').height()
  });

  addEnterLeaveTransition(sceneWorkshop, '#section-workshop-child');

  sceneWorkshop.addTo(controller);

  //-------------------------------------
  // section-work
  //-------------------------------------
  var sceneWork = new ScrollMagic.Scene({
    triggerElement: '#work',
    duration: $('#work').height()
  });

  addEnterLeaveTransition(sceneWork, '#section-work-child');

  sceneWork.addTo(controller);

  //-------------------------------------
  // section-approach
  //-------------------------------------
  var sceneApproach = new ScrollMagic.Scene({
    triggerElement: '#approach',
    duration: $('#approach').height()
  });

  addEnterLeaveTransition(sceneApproach, '#section-approach-child');

  sceneApproach.addTo(controller);

  //-------------------------------------
  // section-about
  //-------------------------------------
  var sceneAbout = new ScrollMagic.Scene({
    triggerElement: '#about',
    duration: $('#about').height()
  });

  addEnterLeaveTransition(sceneAbout, '#section-about-child');

  sceneAbout.addTo(controller);

  //-------------------------------------
  // section-campfire
  //-------------------------------------
  var sceneCampfire = new ScrollMagic.Scene({
    triggerElement: '#campfire',
    duration: $('#campfire').height()
  });

  addEnterLeaveTransition(sceneCampfire, '#section-campfire-child');

  sceneCampfire.addTo(controller);
}

/*---------------------------------------------------------------------------*\
 * Scroll-to-bottom
\*---------------------------------------------------------------------------*/
var scrollToBottom = function () {
  $('html, body').scrollTop( $(document).height() );
  $('body').css('animation-play-state', 'running');
};

var scrollToTop = function () {
  $('html, body').scrollTop( 0 );
};

$('body').on('animationend', function() {
  $(this).css('opacity', 1);
});

/*---------------------------------------------------------------------------*\
 * Scroll Up Button
\*---------------------------------------------------------------------------*/
documentScrollHandler = function (instant) {
  var instantaneous = instant || !loaded;

  var divScrollUp = $('.scroll-up');
  var divSocialIcons = $('.social-fixed');
  var divNarratorLogo = $('.narrator-logo-full');

  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    divScrollUp.addClass('scroll-up-show');
    divSocialIcons.addClass('social-show');
    divNarratorLogo.addClass('narrator-logo-show');
  }
  else {
    divScrollUp.removeClass('scroll-up-show');
    divSocialIcons.removeClass('social-show');
    divNarratorLogo.removeClass('narrator-logo-show');
  }

  var campfireHeight = $('#campfire-video').height();
  var mountainsHeight = $('#mountains-image').height();
  var value = ((controller.scrollPos() + window.innerHeight) - documentHeight()) * window.CAMPFIRE_SCROLL_RATIO;
  value -= campfireHeight * 0.2;

  // For the sake of performance, don't bother continuing to tween the video position once it is already
  // out of view
  value = Math.max(-(campfireHeight + mountainsHeight), value);

  TweenLite.to('.campfire-video-container', instantaneous ? 0 : 1, {
    bottom: value,
    overwrite: 'concurrent',
    ease: Power1.easeOut
  });
};

$(document).scroll(documentScrollHandler);
$(window).resize(function () {
  sectionsScale();
  curSection.style.top = getSectionFocusTop(curSection);
});

function onHashChangeHandler() {
  var hash = window.location.hash.slice(1);

  var subSectionID = '#subsection-' + hash;
  var subSection = $(subSectionID);

  if (subSection.length) {
    // Force body to full opacity
    $(body).css('opacity', 1);

    curSubSection = subSection;

    curSubSection.show();

    $('#sections').hide();

    scrollToTop();
  }
}

$(document).ready(function () {
  var cfv = $('#campfire-video');

  console.log('Video loading state: ', cfv.readyState);

  function videoCanPlayHandler() {
    console.log('Video loaded!');

    // Check to see if we are in a subsection
    onHashChangeHandler();

    sectionsScale();

    if (!window.location.hash) {
      scrollToBottom();
    }

    setupScenes();

    // Remove all jquery events from the video
    cfv.off();
  }

  // Check to see if the video is already loaded enough to play (state 2)
  if (cfv.readyState >= 2) {
    videoCanPlayHandler();
  } else {
    cfv.on('canplay', videoCanPlayHandler);
  }
});

window.onhashchange = onHashChangeHandler;
