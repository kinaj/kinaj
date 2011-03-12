jQuery(function ($) {
  var hideAdvice = function () {
    var options = {
      advice: false
    };
        
    kinaj.advice = false;
        
    if (kinaj.info.is(':visible')) {
      kinaj.info.stop().animate({top: '-22px'}, 450);
            
      $.cookie('kinaj', JSON.stringify(options), {path: '/', expires: 14});
    }
  };
  var listener = function () {
    kinaj.listener(arguments.callee);
  };
  var cookie = $.cookie('kinaj');
    
  if (cookie) {
    cookie = JSON.parse(cookie);
        
    kinaj = $.extend(kinaj, cookie);
  }
    
  kinaj.divlist = $('#showroom div');
  kinaj.navigation = $('ul#navigation');
  kinaj.info = $('#info');
  kinaj.title = $('head title');
    
  $(document).bind('keydown', 'left', function (event) {
    var current = kinaj.divlist.filter(':visible'),
        next = current.prev(),
        id = next.attr('id');

    if (!id) {
      id = kinaj.divlist.filter(':eq(' + (kinaj.divlist.length -1) + ')').attr('id');
    }
        
    window.location.hash = id;
        
    if (kinaj.advice) {
      hideAdvice();
    }
  });
    
  $(document).bind('keydown', 'right', function (event) {
    var current = kinaj.divlist.filter(':visible'),
        next = current.next(),
        id = next.attr('id');
            
    if (!id) {
      id = kinaj.divlist.filter(':first').attr('id');
    }
        
    window.location.hash = id;
        
    if (kinaj.advice) {
      hideAdvice();
    }
  });
    
  kinaj.divlist.find('img').bind('click', function (event) {
    var current = $(this).parent(),
        next = current.next(),
        id = next.attr('id');

    if (!id) {
      id = kinaj.divlist.filter(':first').attr('id');
    }
        
    window.location.hash = id;
  });
  
  kinaj.divlist.find('a.download').bind('click', function (event) {
    var label = kinaj.navigation.find('a.active').attr('title');

    track('projects', 'download', label);
  });
  
  if (window.location.hash.replace('#', '') === 'thankyou') {
    console.log('foo')
    $('h1 img').attr('src', '/img/thankyou.png');

    window.location.hash = '';
  }

  kinaj.timer = setTimeout(listener, 10);
    
  setTimeout(function () {
    if (kinaj.advice) {
      kinaj.info.stop().animate({top: '0px'}, 750);
    }
  }, 3000);
});

var track = function (category, action, label) {
  if (label === 'undefined' && label === undefined) {
    return;
  }
    
  if (_gaq.length) {
     _gaq.push(['_trackPageview', '/'], ['_trackEvent', category, action, label])
  } else {
    window.tracker = window.tracker || _gaq._getAsyncTracker();
    
    if (action !== 'download') {
      tracker._trackPageview('/');
    }

    tracker._trackEvent(category, action, label);
  }
};
var kinaj = {
  advice: true,
  hash: undefined,
  oldHash: undefined,
  changeContent: function (hash) {
    var hash = hash || kinaj.hash,
        id = hash.substr(1, hash.length),
        visible = kinaj.divlist.filter(':visible'),
        next,
        prefix;
        
    if (id.length) {
      next = $('#' + id);
    } else {
      window.location.hash = kinaj.divlist.filter(':first').attr('id');
        
      return;
    }
        
    if (visible.length) {
      visible.fadeOut(200, function () {
        next.fadeIn(500);
      });
    } else {
      next.fadeIn(500);
    }
        
    kinaj.navigation.find('a').removeClass('active');
    kinaj.navigation.find('a[href="' + hash + '"]').addClass('active');
        
    prefix = kinaj.navigation.find('a[href="' + hash + '"]').attr('title');
          
    if (!kinaj.navigation.is(':visible')) {
      kinaj.navigation.fadeIn(750);
    }
        
    kinaj.title.text(prefix + ' | Janik Baumgartner');

    track('projects', 'view', prefix);
  },
  listener: function (listener) {
    clearTimeout(kinaj.timer);

    var location = location || window.location;

    if (location.hash !== kinaj.hash) {
      kinaj.hash = location.hash;

      kinaj.changeContent(kinaj.hash);
    }

    kinaj.timer = setTimeout(listener, 10);
  }
};

