/*global $*/
'use strict';

var setScrollPosition = function () {
    window.setTimeout(function (){
      $('html, body').scrollTop( $(document).height() );
    }, 10);
};

$('html, body').scrollTop( $(document).height() );
$(window).load(setScrollPosition);

$('body').on('animationend', function() {
  $(this).css('opacity', 1);
});
