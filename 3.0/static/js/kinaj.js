jQuery(function($) {
  var $workspace = $('#workspace')
    , historyCallback = function(href) { $workspace.load(href); };

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
