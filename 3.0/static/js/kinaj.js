jQuery(function($) {
  var $workspace = $('#workspace')
    , $navigation = $('#navigation')
    , historyCallback;

  historyCallback = function(href) {
    $workspace.load(href, function() {
      if ((/\/edit$/).test(href)) {
        var id, $li;

        $('input[type="file"]').html5_upload({
          url: href.replace('edit', 'upload'),
          sendBoundary: true,
          fieldName: 'attachment',
          onStart: function(event, total) {
            return true;
          },
          onStartOne: function(event, name, number, total) {
            id = 'attachment' + (+new Date());
            $li = $('<li id="' + id + '">' + name + ' | 0%</li>');

            $('ul.attachments').prepend($li);

            return true;
          },
          onProgress: function(event, progress, name, number, total) {
            $li.text(name + ' | ' + Math.round(progress * 100) + '%');
          },
          onFinishOne: function(event, res, name, number, total) {
            console.log(res);
          },
          onFinish: function(event, total) {
          },
          onError: function(event, name, error) {
          },
        });
      }
    });
    
    $navigation
      .find('a')
      .removeClass('active')
      .end()
      .find('a[href="' + href + '"]')
      .addClass('active');
  };

  $('a.history').history({ callback: historyCallback });

  // delete over ajax
  $('body').delegate('a.delete', 'click', function(event) {
    var $link = $(this)
      , $parent = $link.parent();

    $.ajax({ url: $link.attr('href')
           , cache: false
           , dataType: 'json'
           , type: 'delete'
           , success: function(res) {
              $parent.fadeOut(200);

              if ($link.hasClass('history') && res.redirect) {
                var state = { text: '', href: res.redirect };

                window.history.pushState(state, state.text, state.href);

                historyCallback(state.href);
              } else if (res.redirect) window.location = res.redirect;
             }
           });

    event.preventDefault();
  });

  // ajax form submission
  $('body').delegate('form.async', 'submit', function(event) {
    var $form = $(this);

    $.ajax({ url: $form.attr('action')
           , cache: false
           , dataType: 'json'
           , type: $form.attr('method')
           , data: $form.serialize()
           , success: function(res) {
              var state = { text: '', href: res.redirect };

              if (res.redirect) {
                window.history.pushState(state, state.text, state.href);

                historyCallback(state.href);
              }
             }
           });

    event.preventDefault();
  });
});
