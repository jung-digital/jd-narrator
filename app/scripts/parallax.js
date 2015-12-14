/*eslint no-underscore-dangle: 0*/
/*global $,ScrollMagic,TweenLite,Power1,campfireLoadError,detectAutoplay*/

'use strict';

var loaded = false;
var needsFadeIn = true;
var ANIMATION_SPEED = 1.5;
var body = document.body;
var html = document.documentElement;
var documentScrollHandler;
var gotoSubSection;
var gotoSection;
var campfireVideoDisplayed = true;
var ignoreTouchSwipe = false;

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
  'story-type',
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
  var yOffset = window.innerWidth < 768 ? 0 : 30;
  var rect = section.getBoundingClientRect();
  var percent = ((window.innerHeight - rect.height) / 2 + yOffset) / window.innerHeight;
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
    if (!curSubSection && needsFadeIn) {
      $(document.body).addClass('body-fadein');
    }
  }
}

function scrollAnimateTo(sectionId, speed) {
  var section = $('#' + sectionId);
  var sectionIx = sections.indexOf(sectionId);
  var sy = section.offset().top + (sectionIx === 0 ? 0 : (section.height() / 2));

  console.log('Scroll animate to', sectionId, sy, section.height());

  TweenLite.to(window, speed || 1, {
    scrollTo: {
      y: sy,
      autoKill: false
    },
    overwrite: 'concurrent',
    ease: Power1.easeOut
  });
}

function addEnterLeaveTransition(_scene, element) {
  //-----------------------------------
  // ENTER SECTION
  //-----------------------------------
  _scene.on('enter', function () {
    if (curSubSection) {
      return;
    }

    var tempSection = curSection = $(element).get(0);

    $('#nav-' + tempSection.id.replace('-child', '')).addClass('active');

    TweenLite.to(element, !loaded ? 0 : ANIMATION_SPEED, {
      top: getSectionFocusTop(curSection),
      opacity: 1,
      overwrite: 'concurrent',
      ease: Power1.easeOut
    });

    scrollAnimateTo(curSection.id.replace('section-', '').replace('-child', ''), loaded ? 1 : 0.01);

    if (!loaded) {
      setTimeout(function () {
        firstSceneTransition();
      }, 1);
    }

    setTimeout(function () {
      if (!curSubSection && curSection === tempSection) {
        console.log('Replacing state', _scene.triggerElement().id);

        history.replaceState(null, null, '#' + _scene.triggerElement().id);
      }
    }, 500);
  });

  //-----------------------------------
  // LEAVE SECTION
  //-----------------------------------
  _scene.on('leave', function (event) {
    if (curSubSection) {
      return;
    }

    $('#nav-' + $(element).get(0).id.replace('-child', '')).removeClass('active');

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
  console.log('Setup scenes');

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
    triggerElement: '#story-type',
    duration: $('#story-type').height()
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

  if($(window).scrollTop() > $(document).height() - 1200) {
    divScrollUp.addClass('scroll-up-show');
    divSocialIcons.addClass('social-show');
  }
  else {
    divScrollUp.removeClass('scroll-up-show');
    divSocialIcons.removeClass('social-show');
  }

  var campfireHeight = $('#campfire-video').height();
  var mountainsHeight = $('#mountains-image').height();
  var value = ((scrollMagicController.scrollPos() + window.innerHeight) - documentHeight()) * window.CAMPFIRE_SCROLL_RATIO;
  value -= campfireHeight * 0.2;

  $.magnificPopup.close();

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
  var hash = window.location.hash.slice(1);
  var subSectionID = '#subsection-' + hash;
  var subSection = $(subSectionID);

  if (subSection.length) {
    gotoSection(1);
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

  sectionsScale();

  if (!window.location.hash) {
    scrollToBottom();
  }

  setupScenes();

  // Check to see if we are in a subsection
  onHashChangeHandler();
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
  $(document.body).swipe({
    swipeUp: function() {
      if (ignoreTouchSwipe) {
        return;
      }
      console.log('Swipe Up!', curSection);
      var ix = sectionChildren.indexOf(curSection.id);
      gotoSection(ix + 1, true);
    },
    swipeDown: function() {
      if (ignoreTouchSwipe) {
        return;
      }
      console.log('Swipe Down!');
      var ix = sectionChildren.indexOf(curSection.id);
      if (ix > 0) {
        gotoSection(ix - 1, true);
      }
    },
    threshold: 10,
    excludedElements: '.subsection'
  });
});

gotoSection = function(ix, animate) {
  function _scrollTo(y) {
    curSubSection = undefined;

    $('.section-child').show();
    $('#subsection-carousel').hide();
    $('#subsection-workshop-detail').hide();
    $('#section-header').removeClass('subsection-header-style');
    $('#section-header').removeClass('narrator-logo-full-subsection');

    if (animate) {
      scrollAnimateTo(curSection.id, 0.5);
    } else {
      scrollMagicController.scrollTo(y);
    }
  }

  curSection = $('#section-' + sections[ix] + '-child').get(0);
  console.log('-> section', ix, curSection);

  if (ix === 0) {
    _scrollTo(0);
  } else if (ix === sections.length - 1) {
    _scrollTo($(document).height());
  } else if (sections[ix]) {
    _scrollTo($('#' + sections[ix]).offset().top);
  }
};

gotoSubSection = function(id) {
  console.log('-> subsection', id);

  var subSection = $(id);

  needsFadeIn = false; // Make sure when we leave we don't fade in!

  if (subSection) {
    ignoreTouchSwipe = true;

    // Turn off stars / embers on mobile
    if (window.innerWidth < 768) {
      window.starRenderer.paused = window.emberRenderer.paused = true;
    }

    /// Hide social buttons
    $('.social-fixed-wrapper').hide();

    // Block scrolling
    $(html).css('overflow-y', 'hidden');

    // Make sure everything is visible (page starts black)
    $(body).css('opacity', 1);
    $('#section-header').addClass('subsection-header-style');
    $('#section-header').addClass('narrator-logo-full-subsection');

    curSubSection = subSection;

    $('.section-child').hide();

    if (id === '#subsection-workshop-detail') {
      $('#subsection-workshop-detail').show();
    } else {
      var owl = $('.owl-carousel').data('owlCarousel');
      owl.goTo(1 * subSection.attr('slide'));

      $('#subsection-carousel').show();

      $('#cassetteMap').imageMapResize();
    }
  }
};

window.leaveSubSection = function() {
  var ix = sectionChildren.indexOf(curSection.id);
  curSubSection = undefined;

  console.log('Leaving subsection for: ', curSection.id);

  $(html).css('overflow-y', 'auto');

  $('#subsection-workshop-detail').hide();

  $('.social-fixed-wrapper').show();
  $('#section-header').show();

  window.starRenderer.paused = window.emberRenderer.paused = false;

  ignoreTouchSwipe = false;

  history.replaceState(null, null, '#' + sections[ix]);
  gotoSection(ix);
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

  var owlData = owlEl.data('owlCarousel');

  var btns = $('.dock-item');
  btns.click(function (e) {
    var element = $(e.currentTarget);
    history.replaceState(null, null, element.attr('data-href'));

    var slideNum = 1 * element.attr('slide');

    owlData.goTo(slideNum);

    btns.removeClass('activeDockItem');
    element.addClass('activeDockItem');
  });
  btns.first().addClass('activeDockItem');
});

$(document).on('click', function(event) {
  if (($('#subsection-carousel').is(':visible') ||
       $('#subsection-workshop-detail').is(':visible') ) &&
       !$(event.target).closest('#subsection-carousel').length &&
       !$(event.target).closest('#mobile-menu').length &&
       !$(event.target).closest('.mfp-wrap').length) {
    window.leaveSubSection();
  }
});

/*-----------------------------------------------------*\
 * Vimeo popup lightbox
\*-----------------------------------------------------*/

$(document).ready(function() {
  $('.vimeo').magnificPopup({
    type: 'iframe',
    mainClass: 'mfp-fade',
    removalDelay: 160,
    preloader: false,

    fixedContentPos: false
  });
});
