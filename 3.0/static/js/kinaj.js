jQuery(function($) {
  $('#spaces').delegate('a', 'click', function(event) {
    var link = $(this)
      , workspace = $('#workspace');

    workspace.load(link.attr('href'));
    console.log('click da shit');

    event.preventDefault();
  });
});
