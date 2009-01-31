$(function (){
    $('div#content').bind('change resize', function(event) {
        console.log('content changed');
        console.log(event);
    });
    
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
            
            $('div:not(.visible)', list).css('opacity', '0');
            
            var leftLink = $('<a href="#" title="left" id="left"><img src="/static/img/arrow_left.png" title="left" alt="left" /></a>');
            
            $(leftLink)
                .bind('click', function(event) {
                    var counter = $.data(leftLink, 'counter');
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
                        $('a#right', index_container).css('opacity','1');
                        $(this).css('opacity','0');
                    };
                    
                    return false; 
                })
                .css({position: 'relative', top: '13.5em', left: '-2em', zIndex: 1000, opacity: '0'});
                
            $.data(leftLink,'counter', 0);
            
            var rightLink = $('<a href="#" title="right" id="right"><img src="/static/img/arrow_right.png" title="right" alt="right" /></a>');
            
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
                        $('a#left', index_container).css('opacity','1');
                        $(this).css('opacity','0');
                    };
                    
                    return false; 
                })
                .css({position: 'relative', left: '50em', top: '13.5em', zIndex: 1000});
                
            $(index_container).prepend(rightLink);
            $(index_container).prepend(leftLink);
        };
        
        
        $('div.project', index_container)
            .live("click", function(event) {
                var tar = this;
                var link = $('a',this).get(0);
                var project;
                if (jQuery.data(link,"project") === undefined) {                
                    $.ajax({
                        url: link.href,
                        method: 'get',
                        dataType: 'json',
                        error: function() {
                            alert('Something went wrong!');
                        },
                        success: function(resp) {
                            project = resp;
                            jQuery.data(link,"project",project);

                            changeToSingle(project, index_container, tar.id);
                        }
                    });
                } else {
                    project = jQuery.data(link,"project");

                    changeToSingle(project, index_container, tar.id);
                };          

                return false;
            }).css('cursor','pointer');
    };
});

function changeToSingle(project, index_container, id) {
    var preview = document.createElement('div');
    preview.id = 'preview';
    
    var info = document.createElement('div');
    info.id = 'info';
    
    var back = '<a href="/" title="back" class="back"><img src="/static/img/back.png" alt="back" title="back" /></a>';
    
    $('a#left, a#right', index_container).css('display','none');
    $('div#featured', index_container).stop().animate({opacity: 0}, 300, function() {
        $(this).css('display','none');
    });
    $('div#list', index_container).stop().animate({opacity: 0}, 300, function() {
        $(this).css('display','none');
        
        $(index_container).prepend(info);
        $(index_container).prepend(preview);
        $(index_container).prepend(back);

        $('a.back', index_container).bind('click', function(event) {
            $(this).css('display','none');
            
            $('div#preview', index_container).stop().animate({opacity: 0}, 300, function() {
                $(this).remove();
            });
            $('div#info', index_container).stop().animate({opacity: 0}, 300, function() {
                $(this).remove();
            });
            
            setTimeout(function() {
                $('a#left, a#right', index_container).show();
                $('div#featured, div#list', index_container).show();
                $('div#featured, div#list', index_container).stop().animate({opacity: 1}, 300);
            }, 300);
            
            $(this).remove();
            return false;
        });
        
        $('div.project', index_container)
            .clone(true)
            .css('opacity','0')
            .removeClass('visible')
            .prependTo('div#preview');

        $('div#' + id + ', index_container').prependTo('div#preview');

        $('div#preview div.project', index_container)
            .each(function(index) {
                var div = this;
                $(div).children().hide();

                var link = $('a', this).get(0);

                var project;

                if ($.data(link,'project') === undefined) {
                    $.ajax({
                        url: link.href,
                        method: 'get',
                        dataType: 'json',
                        error: function() {
                            alert('Something went wrong!');
                        },
                        success: function(resp) {
                            project = resp;
                            jQuery.data(link,'project',project);

                            $('img', link).get(0).src = '/static/projects/' + project._id + '/' + project.preview_big;

                            if (div == $('div#preview div.project:first', index_container).get(0)) {
                                $('div#info', index_container)
                                    .css('opacity','0')
                                    .append('<h2>' + project.name + '</h2>')
                                    .append('<p>' + project.text + '</p>')
                                    .append('<ul class="tags"></ul>')
                                    .append('<ul class="attachments"></ul>');

                                for (var i=0; i < project.tags.length; i++) {
                                    $('div#info ul.tags', index_container).append('<li>' + project.tags[i] + '</li>')
                                };

                                for (var attachment in project._attachments) {
                                    $('div#info ul.attachments', index_container).append('<li><a href="/static/projects/' + project._id + '/' + attachment + '">' + attachment + '</a></li>')
                                };
                                
                                $('div#info', index_container).animate({opacity: 1}, 500);
                            };
                        }
                    });
                } else {
                    project = jQuery.data(link,'project');

                    $('img', link).get(0).src = '/static/projects/' + project._id + '/' + project.preview_big;
                };
            });

        $('div#preview div.project:first', index_container)
            .css({zIndex: 3,opacity: 1, padding: '3em'});
        $('div#preview div.project:first', index_container)
            .children()
            .show();
        $('div#preview div.project:nth-child(2)', index_container)
            .css({zIndex: 2,opacity: 1, width: '15.1em', height: '15.1em', left: '1em', top: '2em', backgroundImage: 'url(/static/img/frame2.png)'});
        $('div#preview div.project:nth-child(3)', index_container)
            .css({zIndex: 1,opacity: 1, width: '13em', height: '13em', left: '0em', top: '3em', backgroundImage: 'url(/static/img/frame3.png)'});

        var link = $('div#preview div.project:first a', index_container).get(0);

        $('div#preview div.project', index_container).bind('click', function(event) {
            $('div#preview div.project:first', index_container)
                .children()
                .hide();
            $('div#preview div.project:first', index_container)
                .animate({opacity: 0}, 200, function() {
                    $('div#preview div.project:nth-child(2)', index_container)
                        .css({zIndex: 3, backgroundImage: 'url(/static/img/frame_big.png)'})
                        .stop()
                        .animate({width: '19.5em', height: '19.5em', left: '2em', top: '0em'}, 350, function() {
                            $('div#preview div.project:nth-child(3)', index_container)
                                .css({zIndex: 2, backgroundImage: 'url(/static/img/frame2.png)'})
                                .stop()
                                .animate({width: '15.1em', height: '15.1em', left: '1em', top: '2em'}, 200);
                            $('div#preview div.project:nth-child(4)', index_container)
                                .css({zIndex: 1, width: '13em', height: '13em', left: '0em', top: '3em', backgroundImage: 'url(/static/img/frame3.png)'})
                                .stop()
                                .animate({opacity: 1}, 200);

                            $('div#preview div.project:nth-child(2)', index_container)
                                .children()
                                .css({opacity: 0})
                                .show(200)
                                .animate({opacity: 1}, 200);

                            var link = $('a', this).get(0);

                            $('div#info', index_container).animate({opacity: 0}, 500, function() {

                                var project = $.data(link,'project');
                                $('div#info h2', index_container).text(project.name);
                                $('div#info p', index_container).text(project.text);
                                $('div#info ul.tags', index_container).empty();
                                $('div#info ul.attachments', index_container).empty();

                                for (var i=0; i < project.tags.length; i++) {
                                    $('div#info ul.tags', index_container).append('<li>' + project.tags[i] + '</li>')
                                };

                                for (var attachment in project._attachments) {
                                    $('div#info ul.attachments', index_container).append('<li><a href="/static/projects/' + project._id + '/' + attachment + '">' + attachment + '</a></li>')
                                };

                                $('div#info').animate({opacity: 1}, 500);
                            });

                            $('div#preview div.project:first', index_container)
                                .css({zIndex: 0})
                                .appendTo('div#preview');
                        });
                });

            return false;
        });
    });
}