/*global $,ScrollMagic,TweenLite,Power1,campfireLoadError,detectAutoplay*/
'use strict';

// Constant used for pass-in to startup()
var NO_CAMPFIRE_VIDEO = true;

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
var sectionList;
var curSubSection;

/**
 * This function automatically scales a section based on the window's:
 *
 * - innerWidth out of 968
 * - innerHeight out of 700
 */
function sectionsScale() {
  var scaleX;
  var scaleY;
  var scale;

  if (window.innerWidth < 768) {
    if (window.innerWidth > window.innerHeight) {
      // Mobile Landscape
      scaleX = window.innerWidth / 568;
      scaleY = window.innerHeight / 320;
      scale = Math.max(0.72, Math.min(1, Math.min(scaleX, scaleY)));
      console.log('Scaling Mobile Landscape', scaleX, scaleY, scale);
    } else {
      // Mobile Portrait
      scaleX = window.innerWidth / 320;
      scaleY = window.innerHeight / 568;
      scale = Math.max(0.72, Math.min(1, Math.min(scaleX, scaleY)));
      console.log('Scaling Mobile Portrait', scaleX, scaleY, scale);
    }
  } else {
    // Desktop
    scaleX = window.innerWidth / 968;
    scaleY = window.innerHeight / 700;
    scale = Math.max(0.72, Math.min(1, Math.min(scaleX, scaleY)));
    scale = window.innerWidth < 768 ? 1 : scale;
    console.log('Scaling Desktop', scaleX, scaleY, scale);
  }

  $('.section-child').css('transform', 'scale(' + scale + ',' + scale + ')');
  $('.section-child').css('-ms-transform', 'scale(' + scale + ',' + scale + ')');
  $('.section-child').css('-webkit-transform', 'scale(' + scale + ',' + scale + ')');
  $('.section-child').css('-o-transform', 'scale(' + scale + ',' + scale + ')');
  $('.section-child').css('-moz-transform', 'scale(' + scale + ',' + scale + ')');
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
    documentScrollHandler(undefined, true);

    // If a subsection has already loaded we don't need to fade in the body
    if (!curSubSection) {
      $(document.body).addClass('body-fadein');
    }
  }
}

function addEnterLeaveTransition(_scene, element) {
  _scene.on('enter', function () {
    var tempSectionPlaceholder = curSection = $(element).get(0);

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

    setTimeout(function () {
      if (curSection === tempSectionPlaceholder) {
        console.log('Replacing state', _scene.triggerElement().id);

        history.replaceState(null, null, '#' + _scene.triggerElement().id);
      }
    }, 100);
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

  sectionList = ['section-contact-child',
                'section-story-type-child',
                'section-workshop-child',
                'section-work-child',
                'section-approach-child',
                'section-about-child',
                'section-campfire-child'];
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
documentScrollHandler = function (event, instant) {
  var instantaneous = instant || !loaded;

  var divScrollUp = $('.scroll-up');
  var divSocialIcons = $('.social-fixed');
  var divNarratorLogo = $('.narrator-logo-full');

  if($(window).scrollTop() + $(window).height() > $(document).height() - 500) {
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
  console.log('Resize');
  sectionsScale();
  curSection.style.top = getSectionFocusTop(curSection);
});

function onHashChangeHandler() {
  console.log('Hash Change!', window.location.hash);

  var hash = window.location.hash.slice(1);

  if (hash.toLowerCase() === 'campfire') {
    scrollToBottom();
  }

  var subSectionID = '#subsection-' + hash;
  var subSection = $(subSectionID);

  if (subSection.length) {
    console.log('Moving to subsection', subSection);

    // Force body to full opacity
    $(body).css('opacity', 1);

    curSubSection = subSection;

    curSubSection.show();

    $('#sections').hide();

    scrollToTop();
  }
}

/*---------------------------------------------------------------------------*\
 * document ready
\*---------------------------------------------------------------------------*/
window.startup = function(noCampfireVideo) {
  console.log('Startup');

  if (noCampfireVideo) {
    console.log('Hiding campfire video');
    $('#campfire-video').hide();
    $('#campfire-image').show();

    window.emberRenderer.enabled = false;
  }

  // Check to see if we are in a subsection
  onHashChangeHandler();

  sectionsScale();

  if (!window.location.hash) {
    scrollToBottom();
  }

  setupScenes();
};

//--------------------------------------------------
// The following code is complicated.
// Essentially what we have to do is wait for the
// campfire video to start playing automatically.
// If it doesn't start playing or we have a load error
// we revert to dislaying an image of the campfire
// instead
//--------------------------------------------------
$(document).ready(function () {
  var campfireVideo = $('#campfire-video');

  function videoCanPlayHandler() {
    campfireVideo[0].play();

    window.startup();

    campfireVideo.off();
  }

  function waitForCampfireVideo(autoplay) {
    if (autoplay) {
      if (campfireVideo[0].readyState >= 4) {
        videoCanPlayHandler();
      } else {
        campfireVideo.on('canplay', videoCanPlayHandler);
      }
    } else {
      window.startup(NO_CAMPFIRE_VIDEO);
    }
  }

  if (window.campfireLoadError) {
    console.log('could not load campfire video', campfireLoadError);
    window.startup(NO_CAMPFIRE_VIDEO);
  } else {
    detectAutoplay(100, function (autoplay) {
      if (autoplay) {
        waitForCampfireVideo(autoplay);
      } else {
        window.startup(NO_CAMPFIRE_VIDEO);
      }
    });
  }
});

window.onhashchange = onHashChangeHandler;


$(document).ready(function() {
  $('.touchswipe').swipe({
    swipeUp: function() {
      var index = sectionList.indexOf(curSection.id);
      var nextSection = sectionList[index + 1];
      if (nextSection) {
        controller.scrollTo('#' + nextSection);
      }
    },
    swipeDown: function() {
      var index = sectionList.indexOf(curSection.id);
      var nextSection = sectionList[index - 1];
      if (nextSection) {
        controller.scrollTo('#' + nextSection);
      }
    },
    threshold: 10
  });
});


/*-----------------------------------------------------*\
 * Mobile Menu
\*-----------------------------------------------------*/
$(document).ready(function() {
  var pageScrollLocation;

  $('#btn-open-menu').click(function() {
    pageScrollLocation = $('html, body').scrollTop();
    $('#mobile-menu-fixed').removeClass('mobile-menu-fixed-close').addClass('mobile-menu-fixed-open');
    $('#mouse-shield').css('display', 'block');
    $('html, body').css({
      'overflow': 'hidden',
      'height': '100%'
    });
  });

  var menuClose = function () {
    $('#mobile-menu-fixed').removeClass('mobile-menu-fixed-open').addClass('mobile-menu-fixed-close');
    $('#mouse-shield').css('display', 'none');
    $('html, body').css({
      'overflow': 'auto',
      'height': 'auto'
    });
  };

  $('#btn-close-menu').click(function() {
    menuClose();
    $('html, body').scrollTop(pageScrollLocation);
  });

  $('.mobile-nav li').click(function() {
    menuClose();
  });

  $('#mouse-shield').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    menuClose();
    $('html, body').scrollTop(pageScrollLocation);
    return false;
  });

  $('#mouse-shield, #mobile-menu-fixed').swipe({
    swipeRight: function() {
      menuClose();
      $('html, body').scrollTop(pageScrollLocation);
    },
    threshold: 10,
    allowPageScroll: 'none'
  });
});
