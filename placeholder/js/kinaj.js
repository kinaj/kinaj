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

        if (!id || id === 'about') {
            id = kinaj.divlist.filter(':eq(' + (kinaj.divlist.length -2) + ')').attr('id');
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
            
        if (!id || id === 'about') {
            id = kinaj.divlist.filter(':first').attr('id');
        }
        
        window.location.hash = id;
        
        if (kinaj.advice) {
            hideAdvice();
        }
    });
    
    $('#page h1 a').bind('click', function (event) {
        var el = $(this),
            hash = el.attr('href'),
            id = hash.substr(1, hash.length),
            newHash = kinaj.hash;
        
        window.location.hash = id;
        
        if (newHash === '#about') {
            newHash = '#' + kinaj.divlist.filter(':first').attr('id');
        }
        
        if (id === 'about') {
            el.attr('href', newHash);
        } else {
            el.attr('href', '#about');
        }
        
        event.preventDefault();
    });
    
    kinaj.divlist.find('img').bind('click', function (event) {
        var current = $(this).parent(),
            next = current.next(),
            id = next.attr('id');
        
        if (id !== 'about') {
            window.location.hash = id;
        } else {
            window.location.hash = kinaj.divlist.filter(':first').attr('id');
        }
    });
    
    kinaj.timer = setTimeout(listener, 10);
    
    setTimeout(function () {
        if (kinaj.advice) {
            kinaj.info.stop().animate({top: '0px'}, 750);
        }
    }, 3000);
});

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
        
        if (hash !== '#about') {
            prefix = kinaj.navigation.find('a[href="' + hash + '"]').attr('title');
            kinaj.navigation.show();
        } else {
            prefix = 'About';
            kinaj.navigation.hide();
        }
        
        kinaj.title.text(prefix + ' | Janik Baumgartner');
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
