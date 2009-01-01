$(function (){
    var index_container = $('div#project_list');
    
    if (index_container.length) {
        l = $('div#list div.project', index_container).length;
        ll = $('div#mainlist div.project', index_container).length;
        foo = Math.round((l + ll)/2);
        
        
        $('div#list').css('width', (foo * 13) + 'em');
        
        $('div#mainlist div.project', index_container).insertAfter('div#list div.project:last');
        $('div#mainlist', index_container).remove();
        
        if ((l + ll) > 4) {
            var list = $('div#list', index_container);
            
            $('div.project:first',list).addClass('visible').next().addClass('visible');
            $('div.project:eq(' + (foo) +')',list).addClass('visible').next().addClass('visible');
            
            $('div:not(.visible)', list).css({opacity: 0});
            
            var leftLink = $('<a href="#" title="left" id="left"><img src="/static/img/arrow_left.png" title="left" alt="left" /></a>')
            
            // var leftLink = document.createElement('a');
            // leftLink.href = '#';
            // leftLink.title = 'left';
            // leftLink.id = 'left';
            // leftLink.innerHTML = 'left';
            
            $(leftLink)
                .bind('click', function(event) {
                    var counter = $.data(leftLink, 'counter');
                    console.log(counter)
                    if (counter > 0) {
                        var d = $('div.visible',list).get(1);
                        var dn = $(d).prev().prev();
                        var dd = $('div.visible',list).get(3);
                        var ddn = $(dd).prev().prev();
                        
                        if (dd === undefined) {
                            dd = $('div.visible',list).get(2);
                            ddn = $(dd).prev();
                            $(ddn).animate({opacity: 1}, 200).addClass('visible');
                        } else {
                            $(dd).removeClass('visible').animate({opacity: 0}, 200);
                            $(ddn).animate({opacity: 1}, 200).addClass('visible');
                        };
                        
                        $(d).removeClass('visible').animate({opacity: 0}, 200);
                        $(dn).animate({opacity: 1}, 200).addClass('visible');

                        
                        
                        $(list).animate({left: '+=12.4em'}, 350, 'swing');
                        
                        counter--;
                        
                        $.data(leftLink,'counter',counter);
                    };
                    
                    if (counter >= (foo - 2)) {
                        $('a#right', index_container).css('opacity','0');
                    } else if ((counter > 0) && (counter < (foo - 2))) {
                        $('a#right', index_container).css('opacity','1');
                    } else if (counter === 0) {
                        $(this).css('opacity','0');
                    };
                    
                    return false; 
                })
                .css({position: 'relative', top: '13.5em', left: '-2em', zIndex: 1000, opacity: '0'});
                
            $.data(leftLink,'counter', 0);
            
            var rightLink = $('<a href="#" title="right" id="right"><img src="/static/img/arrow_right.png" title="right" alt="right" /></a>')
            
            $(rightLink)
                .bind('click', function(event) {
                    var counter = $.data(leftLink, 'counter');
                    
                    if (counter < (foo - 2)) {
                        var d = $('div.visible',list).get(0);
                        var dn = $(d).next().next();
                        var dd = $('div.visible',list).get(2);
                        var ddn = $(dd).next().next();
                        
                        $(d).removeClass('visible').animate({opacity: 0}, 200);
                        $(dn).animate({opacity: 1}, 200).addClass('visible');

                        $(dd).removeClass('visible').animate({opacity: 0}, 200);
                        $(ddn).animate({opacity: 1}, 200).addClass('visible');
                        
                        $(list).animate({left: '-=12.4em'}, 350, 'swing');
                        
                        counter++;
                        
                        $.data(leftLink,'counter',counter);
                    };
                    
                    if (counter === 0) {
                        $('a#left', index_container).css('opacity','0');
                    } else if ((counter > 0) && (counter < (foo - 2))) {
                        $('a#left', index_container).css('opacity','1');
                    } else if (counter >= (foo - 2)) {
                        $(this).css('opacity','0');
                    };
                    
                    return false; 
                })
                .css({position: 'relative', left: '50em', top: '13.5em', zIndex: 1000});
                
            $(index_container).prepend(rightLink);
            $(index_container).prepend(leftLink);
        };
    };

    // if ($('div#project_list').length) {
    //     $('div.project').live("click", function(event) {
    //         var link = $('a',this)[0];
    //         var project;
    //         if (jQuery.data(link,"project") === undefined) {                
    //             $.ajax({
    //                 url: link.href,
    //                 method: 'get',
    //                 dataType: 'json',
    //                 error: function() {
    //                     alert('Something went wrong!');
    //                 },
    //                 success: function(resp) {
    //                     project = resp;
    //                     jQuery.data(link,"project",project);
    //                    
    //                     changeToSingle(project);
    //                 }
    //             });
    //         } else {
    //             project = jQuery.data(link,"project");
    //             
    //             changeToSingle(project);
    //         };          
    //         
    //         return false;
    //     }).css('cursor','pointer');
    // };
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