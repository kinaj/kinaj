$(function (){
    if ($('div#project_list').length) {
    
        var project_list = $('div#project_list');
        var projects = $('div.project', project_list);
        var projects_links = $('a', projects);
        
        $(projects_links).bind('click', function(event) {
            var $$ = this;
            var project;
            
            if (jQuery.data($$,"project") === undefined) {
                $.ajax({
                   url: this.href,
                   method: 'get',
                   dataType: 'json',
                   error: function(resp) {
                        alert('Something went wrong!');
                   },
                   success: function(resp) {
                       project = resp;

                       jQuery.data($$,"project",project);
                       
                       changeToSingle(project);
                   }
                });
            } else {
                project = jQuery.data($$,"project");
                
                changeToSingle(project);
            };
            
            return false; 
        });
        
    };
    
});

function changeToSingle(project) {
    $('div#project_list div#list div').css('display', 'none');
}