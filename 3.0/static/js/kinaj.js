jQuery(function($) {
  var $workspace = $('#workspace')
    , $navigation = $('#navigation')
    , historyCallback, id, $li;

  historyCallback = function(href) {
    $workspace.load(href);
    
    $navigation
      .find('a')
      .removeClass('active')
      .end()
      .find('a[href="' + href + '"]')
      .addClass('active');
  };

  $('a.history:not(.delete)').history({ callback: historyCallback });

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

  $('input[type=file]').live('click', function(event) {
    var $input = $(this)
      , $form = $input.parents('form:first')
      , attachmentPath = $form.attr('action').replace('update', 'attachments/')
      , alreadyBound = 'change' in ($input.data('events') || {});

    if (!alreadyBound)
      $input.html5_upload({
        url: attachmentPath + 'set',
        sendBoundary: true,
        fieldName: 'attachment',
        onStart: function(event, total) {
          return true;
        },
        onStartOne: function(event, name, number, total) {
          id = 'attachment' + (+new Date());
          $li = $('<li id="' + id + '"><a href="' + attachmentPath + '">' + name + '</a><span class="progress"> | 0%</span></li>');

          $('ul.attachments').prepend($li);

          return true;
        },
        onProgress: function(event, progress, name, number, total) {
          $li.find('span.progress').text(' | ' + Math.round(progress * 100) + '%');
        },
        onFinishOne: function(event, res, name, number, total) {
          var res = JSON.parse(res)
            , $a = $li.find('a')

          $li.find('span.progress').fadeOut(200)

          console.log($a.attr('href'))
          console.log(typeof res);
          $a.attr('href', $a.attr('href') + res.filename);
          console.log($a.attr('href'))
        },
        onFinish: function(event, total) {
        },
        onError: function(event, name, error) {
        }
      });
  });
});
