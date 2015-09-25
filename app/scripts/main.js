/*global $*/
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
  colors: ['#D6BD9F', '#B77F49', '#EFD7BF', '#A44C2C', '#D2A383']
});

// var ctx = canvas.getContext('2d');

// canvas.addEventListener('resize', canvasOverlayResize.bind(canvas));

// function canvasOverlayResize() {
//   this.style.width = window.innerWidth;
//   this.style.height = window.innerHeight;

//   this.setAttribute('width', window.innerWidth);
//   this.setAttribute('height', window.innerHeight);

//   ctx.reset
//   ctx.fillStyle = 'red';
//   ctx.fillRect(0, 0, 100, 100);
// }

// canvasOverlayResize.call(canvas);