// #TODO
// * AccessBars scroll point in desktop

// Common for both headers
$(function() {
  var $top_anch = $('a[href="#top_anchor"]');

  $top_anch.click(function(ev) {

    $.smoothScroll(0);
    $('header').removeClass('revealed');

    // $('html, body').animate({
    //   scrollTop: 0
    // }, 1000);

    ev.preventDefault();
  });
});

// Mobile header (collapsed menu)
$(function() {
  'use strict';

  var $header = $('header'),
      $menu_link = $('#menu_link'),
      $links = $header.find('nav#menu a'),
      $window = $(window),
      header_height = $header.outerHeight();

  header_height = 56;

  $menu_link.click(function(ev) {
    $header.toggleClass('revealed');

    ev.preventDefault();
  });


  $links.click(function(ev) {
    var href = $(this).attr('href'),
        $anch = $('.image_separator[data-above-page='+href.replace('#', '')+']'),
        scroll_pos = $anch.offset().top;

    if(window.innerWidth < 1090)
      scroll_pos -= (header_height-1);

    $header.removeClass('revealed');

    $.smoothScroll(scroll_pos);
    // $window.scrollTop( /*+ 260*/ /* translate3d */);

    ev.preventDefault();
  });
});

// Desktop header
$(function() {
  'use strict';

  var $window = $(window),
      $header = $('header'),
      $big_logo = $('big_logo'),
      logo_height = 340, // Static value
      logo_top = window.innerHeight * 0.2, // Static value
      trigger_point = logo_top + logo_height,
      main_top = window.innerHeight; // Should be right

  function checkScroll() {
    var scroll_y = window.pageYOffset;

    if(main_top - scroll_y < trigger_point) {
      $header.addClass('expanded');
    }
    else {
      $header.removeClass('expanded');
    }
  }

  $window.scroll(checkScroll);
  checkScroll();
});




// Smooth scroll jQuery plugin
$(function() {
  var $elem = $('html,body'),
      time = 1000;


  $.smoothScroll =
    Modernizr.touch ? function(y) {
      // Touch, we just jump
      window.scrollTo(0,y);
    } : function(y) { // No touch, we do it smooth

      $elem.animate({
        scrollTop: y,
        easing: 'swing'
      }, time);
    };
});