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
var canvas = document.getElementById('embers');

var embers = new Embers(canvas, {
  debug: true,
  colors: ['#D6BD9F', '#B77F49', '#EFD7BF', '#A44C2C', '#D2A383'],
  maxSparkSize: 2,
  minSparkSize: 0.8,
  maxSparkVelocity: 110,
  minSparkVelocity: 50,
  maxSparkLife: 20,
  maxTailLength: 15,
  sparkSource: {
    target: document.getElementById('campfire-video'),
    widthProp: 'clientWidth',
    heightProp: 'clientHeight',
    offset: {
      x: '50%',
      y: '60%'
    }
  }
});

console.log('Embers started', embers);
