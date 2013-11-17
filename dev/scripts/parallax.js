// #TODO
// 
// * Listen to window size change and update vars

// Setup
$(function() {
  // Decide if we should parallax
  var parallax = true;

  if(window.innerWidth < 800) // Find some nice break value, Also uodate on window size change
    parallax = false;

  if(parallax) {
    $('.image_separator').parallax();
  }
  else {
  }

});

// Parallax plugin
(function($) {
  $.fn.parallax = function(settings) {
    settings = settings || {};

    settings.speed = settings.speed || 0.6,
    settings.startOffset = settings.startOffset || 0,
    settings.endOffset = settings.endOffset || 0,

    this.each(function() {
      var $t = $(this),
          $para =  $t.find('.para_div'), // $('#para-'+$t.attr('data-para-id')), // Could load resources here
          $img = $para.find('.para_img'),
          visible = false,
          speed = parseFloat($('').attr('data-para-speed') || settings.speed);

      var bounds = {
        startY: $t.offset().top,
        endY: $t.offset().top + $t.height()
      };



      $t.check = function(scrollValue) {
        // $('.debug').html(
        //   $('.debug').html() + '<br>' +
        //   bounds.startY + ', ' + bounds.endY
        // );

        var upperY = scrollValue,
            windowH = window.innerHeight,
            lowerY = upperY + windowH;

        if(bounds.startY < lowerY && bounds.endY > upperY) {

          if(!visible) {
            visible = true;
            $para.css('visibility', 'visible');
          }

          var s = ((bounds.startY) - upperY);

          var y = (s+settings.startOffset) - (s / speed);

          $para.css('transform', 'translate3D(0,'+y+'px,0)');
          // $para.css('top', y+'px');
        }
        else {
          if(visible) {
            visible = false;
            $para.css('visibility', 'hidden');
          }
        }
      };

      addObject($t);
    });
  };


  var requestAnimationFrame =
    window.requestAnimationFrame ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame ||
    window.msRequestAnimationFrame ||
    function(callback) {
      return setTimeout(callback, 16);
    };

  var scheduled = false,
      lastScrollValue = -1,
      objs = [];

  function addObject(obj) {
    if(!objs.length) {
      $('html').addClass('parallax');
      $('html').removeClass('no_parallax');
      $(window).scroll(onScroll);
    }

    objs.push(obj);
    requestRepaint();
  }
  function onScroll(ev) {
    lastScrollValue = window.pageYOffset;
    requestRepaint();
  }
  function requestRepaint() {
    if(!scheduled)
      requestAnimationFrame(repaint);
    scheduled = true;
  }
  function repaint() {
    scheduled = false;
    $('.debug').text(lastScrollValue + ', ' + (lastScrollValue + window.innerHeight));
    for(var i = 0, len = objs.length; i < len; ++i) {
      objs[i].check(lastScrollValue);
    }
  }
}(jQuery));