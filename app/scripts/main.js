var setScrollPosition = function () {
  if ($(document).scrollTop() == 0) {
    $('html, body').scrollTop( $(document).height() );
  }
};

$('html, body').scrollTop( $(document).height() );
$(window).load(setScrollPosition);

$("body").on("animationend", function(event) {
  $(this).css("opacity", 1);
});
