$(function() {
  var parallax = false;
  var enable_header_transition;

  if('ontouchstart' in window) {
    enable_header_transition = false;
  }
  else {
    enable_header_transition = true;
  }

  var $header = $('header');


  var img_top = window.innerHeight * 0.2;
  var img_height = 340;

  // var logo_trigger = $('.logo').height() + $('.logo').offset().top;
  var logo_trigger = img_top + img_height;
  var main_top = $('.main').offset().top;
  var $logo = $('.top_logo img');



  // Fix links from header
  // Push scroll down a bit beacause of floating header
  $('.tabs a.tab').each(function() {
    var $o = $(this);
    var elem = $($o.attr('href'));

    var margin = parseInt($('header').height(), 10);
    var scrollToY = elem.offset().top - margin;


    $o.click(function(ev) {
      ev.preventDefault();

      window.scrollTo(0, scrollToY);
    });
  });
  

  // If header should animate
  // If not it starts as compressed
  if(enable_header_transition) {
    $header.addClass('small');
    // Use a timeout to avoid initial transition from compressed to start-state
    setTimeout(function() {
      $header.addClass('transition_enabled');
    },0);

    function checkScroll(ev) {
      var scrollY = window.pageYOffset;

      if(main_top - scrollY < logo_trigger) {
        $header.removeClass('small');
        $logo.addClass('hide');
      }
      else {
        $header.addClass('small');
        $logo.removeClass('hide');
      }
    }

    $(window).scroll(checkScroll);
    checkScroll({});
  }


  if(parallax) {
    var settings = {
      startOffset: -100,
      speed: 0.5
    };

    $('.image_separator').parallax(settings);
    $('.first_page').parallax(settings);
  }
});




//////////////
// Parallax //
//////////////
(function($) {
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


  $.fn.parallax = function(settings) {
    settings = settings || {};

    settings.speed = settings.speed || 0.8,
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
        $('.debug').html(
          $('.debug').html() + '<br>' +
          bounds.startY + ', ' + bounds.endY
        );

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
}(jQuery));


// Watch links
// Listen for scroll events / alternative poll intervall
// On setup checks links href if they are to elements within document (#)
// Watch for when scrolled within bounds of referenced element and 
// add .active class to element
// All elements which are grouped together should be in jquery-object when method is called
//   they will behave as only one active at a time
(function($) {



  $.fn.watchLinks = function(settings) {
    // Settings contains information about alternative elements to add class .active
    settings = settings || {};

    var active = null,
        $links = this,
        objs = [];

    // Loop through elements and check their href
    // For each link in $links
    for(var link_n = 0, link_len = $links.length; link_n < link_len; ++link_n){
      var link = $links[link_n],
          href = link.attr('href');

      if(typeof href === 'string' && href.indexOf('#') === 0) {
        var watch = $(href);

        objs.push({
          $link: link,
          $eleemnt: getElement(link),
          $watched: watch,
          top: watch.offset().top
        });
      }
    }
    // Sort according to top
    objs.sort(function(a, b) {
      return a.top > b.top;
    });



    function update() {
      var y_value = window.innerHeight + window.pageYOffset,
          last = null;

      // For each object in objs
      for(var object_n = 0, object_len = objs.length; object_n < object_len; ++object_n){
        var object = objs[object_n],
            top = object.$watched.offset().top;
        
        if(y_value > top)
          last = object;
        else
          break;
      }

      if(last)
        setActive(last);
    }

    function setActive(obj) {
      // Only do work if it's a new object that's active
      if(obj === active)
        return;

      active.$element.removeClass('active');
      active = obj;
      active.$element.addClass('active');
    }

    function getElement($link) {
      // Return according to settings
      if(settings.parent) {
        return $link.parent(settings.parent);
      }
    }
  };
}(jQuery));




function getImagePosByScroll(obj) {
  var y_val = window.pageYOffset + window.innerHeight;

  var page_above_height = 500;
  var page_below_height = 500;
  var showing_space_height = 400;
  var total_area = page_above_height + page_below_height + showing_space_height;

  var page_above_top = 0;
  var page_below_top = page_above_top + page_above_height + showing_space_height;

  // How much is it allowed to move at max
  var max_parallax_movement = 400; 
  var min_parallax_movement = 0;

  var top_visible_point = 0;

  var visible = (y_val > page_above_top + page_above_height);

  var image_height = 1071;


  // Längden som den har på sig att arbeta under
  // window.height + show_space.height
  // 
  // Distansen som den ska avverka
  // above.height + show_space.height + below.height - image.height
  // 
  // Krav som måste uppfyllas av bilden
  // image.height > above.height + show


  // När show_space.top är i botten av sidan
  // så ska image.y == page_above_top
  


  // När show_space.bottom är i top av sidan
  // så ska image.y + image.height == page_below_top + page_below_height
}




// Page min height: 500px
// Page separator height: 400 px
// Total 500*2 + 400
// = 1400
