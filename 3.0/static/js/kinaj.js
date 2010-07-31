jQuery(function($) {
  // simple ajaxified navigation
  $('#spaces').delegate('a', 'click', function(event) {
    var $link = $(this)
      , $workspace = $('#workspace');

    $workspace.load($link.attr('href'));

    event.preventDefault();
  });

  // delete over ajax
  $('body').delegate('a.delete', 'click', function(event) {
    var $link = $(this)
      , $parent = $link.parent();

    $.ajax({ url: $link.attr('href')
           , cache: false
           , dataType: 'json'
           , type: 'delete'
           , success: function(res) { $parent.fadeOut(200); }
           });

    event.preventDefault();
  });
});
