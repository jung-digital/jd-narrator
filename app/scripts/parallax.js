/*eslint no-underscore-dangle: 0*/
/*global $,ScrollMagic,TweenLite,Power1,campfireLoadError,detectAutoplay*/

'use strict';

// Constant used for pass-in to startup()
var loaded = false;
var ANIMATION_SPEED = 2;
var body = document.body;
var html = document.documentElement;
var documentScrollHandler;
var gotoSubSection;
var gotoSection;
var campfireVideoDisplayed = true;

var curSection;
var curSubSection;
var sectionChildren = ['section-contact-child',
  'section-story-type-child',
  'section-workshop-child',
  'section-work-child',
  'section-approach-child',
  'section-about-child',
  'section-campfire-child'];
var sections = ['contact',
  'story',
  'workshop',
  'work',
  'approach',
  'about',
  'campfire'];

/*---------------------------------------------------------------------------*\
 * Scaling Sections
\*---------------------------------------------------------------------------*/
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

  return loaded || section === curSection ? (percent * 100) + '%' : '-200%';
}

/*------------------------------------------------------------------------------------*\
 * Scenes
 * Broken up into 7 sections of 1200 pixels each
\*------------------------------------------------------------------------------------*/
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

    console.log('Entering', tempSectionPlaceholder);
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
      if (!curSubSection) {
        if (curSection === tempSectionPlaceholder) {
          console.log('Replacing state', _scene.triggerElement().id);

          history.replaceState(null, null, '#' + _scene.triggerElement().id);
        }
      }
    }, 500);
  });

  _scene.on('leave', function (event) {
    if ($(window).scrollTop() >= 0) {
      TweenLite.to(element, !loaded ? 0 : ANIMATION_SPEED, {
        top: event.scrollDirection === 'REVERSE' ? '200%' : '-200%',
        opacity: 0,
        overwrite: 'concurrent',
        ease: Power1.easeInOut
      });
    }
  });
}

function documentHeight() {
  return Math.max(body.scrollHeight, body.offsetHeight, html.clientHeight, html.scrollHeight, html.offsetHeight);
}

var scrollMagicController = new ScrollMagic.Controller({
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

  sceneContact.addTo(scrollMagicController);

  //-------------------------------------
  // section-story-type
  //-------------------------------------
  var sceneStoryType = new ScrollMagic.Scene({
    triggerElement: '#story',
    duration: $('#story').height()
  });

  addEnterLeaveTransition(sceneStoryType, '#section-story-type-child');

  sceneStoryType.addTo(scrollMagicController);

  //-------------------------------------
  // section-workshop
  //-------------------------------------
  var sceneWorkshop = new ScrollMagic.Scene({
    triggerElement: '#workshop',
    duration: $('#workshop').height()
  });

  addEnterLeaveTransition(sceneWorkshop, '#section-workshop-child');

  sceneWorkshop.addTo(scrollMagicController);

  //-------------------------------------
  // section-work
  //-------------------------------------
  var sceneWork = new ScrollMagic.Scene({
    triggerElement: '#work',
    duration: $('#work').height()
  });

  addEnterLeaveTransition(sceneWork, '#section-work-child');

  sceneWork.addTo(scrollMagicController);

  //-------------------------------------
  // section-approach
  //-------------------------------------
  var sceneApproach = new ScrollMagic.Scene({
    triggerElement: '#approach',
    duration: $('#approach').height()
  });

  addEnterLeaveTransition(sceneApproach, '#section-approach-child');

  sceneApproach.addTo(scrollMagicController);

  //-------------------------------------
  // section-about
  //-------------------------------------
  var sceneAbout = new ScrollMagic.Scene({
    triggerElement: '#about',
    duration: $('#about').height()
  });

  addEnterLeaveTransition(sceneAbout, '#section-about-child');

  sceneAbout.addTo(scrollMagicController);

  //-------------------------------------
  // section-campfire
  //-------------------------------------
  var sceneCampfire = new ScrollMagic.Scene({
    triggerElement: '#campfire',
    duration: $('#campfire').height()
  });

  addEnterLeaveTransition(sceneCampfire, '#section-campfire-child');

  sceneCampfire.addTo(scrollMagicController);
}

/*---------------------------------------------------------------------------*\
 * Scrolling Utilities
\*---------------------------------------------------------------------------*/
function scrollToBottom() {
  scrollMagicController.scrollTo($(document).height());
  $('body').css('animation-play-state', 'running'); // For initial load
}

function scrollToTop() {
  scrollMagicController.scrollTo(0);
}

$('body').on('animationend', function() {
  $(this).css('opacity', 1);
});

documentScrollHandler = function(event, instant) {
  if (window.menuOpen) {
    return;
  }

  var instantaneous = instant || !loaded;

  var divScrollUp = $('.scroll-up');
  var divSocialIcons = $('.social-fixed');
  var divNarratorLogo = $('.narrator-logo-full');

  if($(window).scrollTop() > $(document).height() - 1200) {
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
  var value = ((scrollMagicController.scrollPos() + window.innerHeight) - documentHeight()) * window.CAMPFIRE_SCROLL_RATIO;
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

/*---------------------------------------------------------------------------*\
 * Window Resize
\*---------------------------------------------------------------------------*/
$(window).resize(function () {
  console.log('Resize');
  sectionsScale();
  if (curSection) {
    curSection.style.top = getSectionFocusTop(curSection);
  }
});

/*---------------------------------------------------------------------------*\
 * window.location Change
\*---------------------------------------------------------------------------*/
function onHashChangeHandler() {
  console.log(window.location.hash);

  var hash = window.location.hash.slice(1);
  var subSectionID = '#subsection-' + hash;
  var subSection = $(subSectionID);

  if (subSection.length) {
    gotoSubSection(subSectionID);
  } else if (hash) {
    gotoSection(sectionChildren.indexOf('section-' + hash + '-child'));
  }
}

/*---------------------------------------------------------------------------*\
 * document ready
\*---------------------------------------------------------------------------*/
window.startup = function() {
  if (!campfireVideoDisplayed) {
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
      campfireVideoDisplayed = false;
      window.startup();
    }
  }

  if (window.campfireLoadError) {
    console.log('could not load campfire video', campfireLoadError);
    campfireVideoDisplayed = false;
    window.startup();
  } else {
    detectAutoplay(100, function (autoplay) {
      if (autoplay) {
        waitForCampfireVideo(autoplay);
      } else {
        campfireVideoDisplayed = false;
        window.startup();
      }
    });
  }
});

window.onhashchange = onHashChangeHandler;

$(document).ready(function() {
  $('.touchswipe').swipe({
    swipeUp: function() {
      console.log('Swipe Up!');
      var ix = sectionChildren.indexOf(curSection.id);
      gotoSection(ix + 1);
    },
    swipeDown: function() {
      console.log('Swipe Down!');
      var ix = sectionChildren.indexOf(curSection.id);
      gotoSection(ix - 1);
    },
    threshold: 10
  });
});

gotoSection = function(ix) {
  function scrollTo(y) {
    console.log('-> section', sectionChildren[ix], y);
    curSubSection = undefined;
    $('#sections').show();
    $('#subsection-carousel').hide();
    $('#section-header').removeClass('subsection-header-style');
    $('#section-header').removeClass('narrator-logo-full-subsection');
    scrollMagicController.scrollTo(y);
  }

  if (ix === 0) {
    scrollTo(0);
  } else if (ix === sections.length - 1) {
    scrollTo($(document).height());
  } else if (sections[ix]) {
    scrollTo($('#' + sections[ix]).offset().top);
  }
};

gotoSubSection = function(id) {
  console.log('-> subsection', id);

  var subSection = $(id);

  if (subSection) {
    $(html).css('overflow-y', 'visible');
    $(body).css('opacity', 1);
    $('#section-header').addClass('subsection-header-style');
    $('#section-header').addClass('narrator-logo-full-subsection');

    curSubSection = subSection;

    var owl = $('.owl-carousel').data('owlCarousel');
    owl.goTo(1 * subSection.attr('slide'));

    $('#subsection-carousel').show();
    $('#sections').hide();

    scrollToTop();
  }
};

window.leaveSubSection = function() {
  curSubSection = undefined;
  $(html).css('overflow-y', 'auto');
  gotoSection(sectionChildren.indexOf(curSection.id));
};

/*-----------------------------------------------------*\
 * Mobile Menu
\*-----------------------------------------------------*/
window.menuOpen = false;

$(document).ready(function() {
  $('#btn-open-menu').click(function() {
    window.menuOpen = true;
    $(document).disablescroll('disable');
    $('.mobile-menu-fixed').addClass('mobile-menu-fixed-open');
    $('#mouse-shield').css('display', 'block');
  });

  var menuClose = function () {
    window.menuOpen = false;
    $(document).disablescroll('undo');
    $('.mobile-menu-fixed').removeClass('mobile-menu-fixed-open');
    $('#mouse-shield').css('display', 'none');
  };

  $('#btn-close-menu').click(function() {
    menuClose();
  });

  $('.mobile-nav li').click(function() {
    menuClose();
  });

  $('#mouse-shield').click(function(e){
    e.preventDefault();
    e.stopPropagation();
    menuClose();
    return false;
  });

  $('#mouse-shield, #mobile-menu-fixed').swipe({
    swipeRight: function() {
      menuClose();
    },
    threshold: 10,
    allowPageScroll: 'none'
  });
});


/*-----------------------------------------------------*\
 * Subsection carousel
\*-----------------------------------------------------*/
$(document).ready(function() {
  var owlEl = $('.owl-carousel');
  owlEl.owlCarousel({
    margin: 10,
    pagination: false,
    loop: false,
    singleItem: true,
    afterAction: function() {
      $('.dock-item').removeClass('activeDockItem');
      $('.dock-item[slide="' + this.owl.currentItem + '"]').addClass('activeDockItem');
      //TODO: history.replaceState(null, null, %current slide hash%);
    }
  });

  var owl = $('.owl-carousel').data('owlCarousel');
  var btns = $('.dock-item');
  btns.click(function (e) {
    var element = $(e.currentTarget);
    history.replaceState(null, null, element.attr('data-href'));
    owl.goTo(1 * element.attr('slide'));

    btns.removeClass('activeDockItem');
    element.addClass('activeDockItem');
  });
  btns.first().addClass('activeDockItem');
});

$(document).on('click', function(event) {
  if (curSubSection && !$(event.target).closest('#subsection-carousel').length) {
    window.leaveSubSection();
  }
});