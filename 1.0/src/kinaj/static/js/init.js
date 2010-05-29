jQuery(function($) {
    
    $('div#project_list').kinajShowroom();
    
    if ($('div#ulist').length) {
        
        $('div#ulist a.delete').bind('click', function(event) {
            
            var sid = $(this).parent().parent().attr('id');
            
            if (confirm("Really want delete this Document?")) { 
                Kinaj.fn.ajax({
                    type: 'delete',
                    url: '/u/delete/' + sid,
                    success: function(resp) {
                        $('li#' + sid).slideUp(500, function() {
                            $(this).remove();
                        })
                    }
                })
            }
            
            return false;
        });
    };
});