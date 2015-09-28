/*global $,Embers*/
'use strict';

/*---------------------------------------------------------------------------*\
 * Scroll-to-bottom
\*---------------------------------------------------------------------------*/
var setScrollPosition = function () {
    window.setTimeout(function (){
      $('html, body').scrollTop( $(document).height() );
    }, 10);
    $('body').css('animation-play-state', 'running');
};

$('html, body').scrollTop( $(document).height() );
$(window).load(setScrollPosition);

$('body').on('animationend', function() {
  $(this).css('opacity', 1);
});

$(document).scroll(function () {
  var divScrollUp = $('#scrollUp');

  if($(window).scrollTop() + $(window).height() > $(document).height() - 100) {
    divScrollUp.addClass('scroll-up-show');
  }
  else {
    divScrollUp.removeClass('scroll-up-show');
  }
});

/*---------------------------------------------------------------------------*\
 * Canvas Overlay
\*---------------------------------------------------------------------------*/
var canvas = document.getElementById('canvasOverlay');

var embers = new Embers(canvas, {
  debug: false,
  colors: ['#D6BD9F', '#B77F49', '#EFD7BF', '#A44C2C', '#D2A383'],
  maxSparkSize: 3,
  minSparkSize: 1.2,
  maxSparkVelocity: 150,
  minSparkVelocity: 70,
  maxSparkLife: 20,
  maxTailLength: 15,
  sparkSource: {
    target: document.getElementById('campfire'),
    widthProp: 'clientWidth',
    heightProp: 'clientHeight',
    offset: {
      x: '50%',
      y: '60%'
    }
  }
});

console.log('Embers started', embers);
