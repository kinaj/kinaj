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
    var featured = $('div#project_list div#featured');
    
    var temp_a = document.createElement('a');
    temp_a.href = '#';
    temp_a.className = 'temp';
    temp_a.title = project.name;
    
    $(temp_a).bind('click', function(event) {
        
        return false;
    });
    
    var temp_img = document.createElement('img');
    temp_img.src = 'http://localhost:5984/kinaj/' + project._id + '/' + project.preview_big;
    temp_img.title = project.name;
    temp_img.alt = project.name;
    
    $(temp_a).append(temp_img);

    $(temp_a).css('opacity','0');
    
    var list =  $('div#project_list div#list');
    
    var info = document.createElement('div');
    info.className = 'info';
    
    $(info).css({opacity: 0});
    
    var back = document.createElement('a');
    back.href = '#';
    back.title = 'back';
    back.innerHTML = 'back';
    
    $(back).bind('click', function(event) {
        $('div#project_list div#list div.info').remove();
        $('div#project_list div#list div.project').show().animate({opacity: 1}, 500);
        
        $('div#project_list div#featured div.project a.temp').remove();
        $('div#project_list div#featured div.project a').show().animate({opacity: 1}, 500);
        
        return false;
    });
    
    var name = document.createElement('h2');
    name.innerHTML = project.name;
    
    var text = document.createElement('p');
    text.innerHTML = project.text;
    
    var tags = document.createElement('ul');
    tags.className = 'tags';
    
    for (var i=0; i < project.tags.length; i++) {
        var li = document.createElement('li');
        li.innerHTML = project.tags[i];
        $(tags).append(li);
    };
    
    var attachments = document.createElement('ul');
    attachments.className = 'attachments';
    
    for (var attachment in project._attachments) {
        var li = document.createElement('li');
        var a = document.createElement('a');
        a.innerHTML = attachment;
        a.title = attachment;
        a.href = 'http://localhost:5984/kinaj/' + project._id + '/' + attachment;
        
        $(li).append(a);
        
        $(attachments).append(li);
    }
    
    $(info).append(back);
    $(info).append(name);
    $(info).append(text);
    $(info).append(tags);
    $(info).append(attachments);
    
    if (!(temp_img.src === $('div.project a img', featured)[0].src)) {
        $('div.project a', featured).animate({opacity: 0}, 500).hide();
        $('div.project', featured).append(temp_a);
        $('div#project_list div#featured div.project a.temp').animate({opacity: 1}, 500);
    };
    
    $('div', list).animate({opacity: 0}, 500).css('display','none');
    $(list).append(info);
    $('div#project_list div#list div.info').animate({opacity: 1}, 500);
}