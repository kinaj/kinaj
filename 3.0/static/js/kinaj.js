jQuery(function($) {
  var $workspace = $('#workspace');

  $('a').history({ callback: function(href) { $workspace.load(href); } });

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

              if (res.redirect) window.location = res.redirect;
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
              if (res.redirect) window.location = res.redirect;
             }
           });

    event.preventDefault();
  });

});
