/*
 * Kinaj
 * version: 0.3
 *
 * @requires jQuery
 *
 * 
*/

(function($) {

// .kinajShowroom()
$.fn.kinajShowroom = function(options) {
    
    var opts = $.extend({}, Kinaj.defaults, options);
    
    return this.each(function(idx) {
        
        new Kinaj.Showroom( this , opts );
        
    });
    
};
    

// Kinaj object
Kinaj = window.Kinaj = function() {
    
    return new Kinaj.fn.init();
    
};


Kinaj.defaults = {
    
    ajaxSetup: {
        
        // options
        async: true,
        cache: false,
        contentType: 'application/json',
        dataType: 'json',
        global: true,
        ifModified: false,
        jsonp: '',
        password: '',
        processData: false,
        scriptCharset: '',
        timeout: 5000,
        type: 'get',
        url: '/',

        // functions
        beforeSend: function( xhr ) {
            // some code here...
        },
        
        complete: function( xhr , status ) {
            // some code here...
        },

        dataFilter: function( data , type ) {
            // some code here...
            
            // must return data so following functions can handle it
            return data;
        },
        
        error: function( xhr , status , error ) {
            // some code here...
        },
        
        success: function( data , status ) {
            // some code here...
        },

        // modify this function for special XMLHttpRequest object creation
        xhr:function(){
            
            // must return an object
			return window.ActiveXObject ? new ActiveXObject("Microsoft.XMLHTTP") : new XMLHttpRequest();
		}
		
    }
    
}


Kinaj.fn = Kinaj.prototype = {
    
    init: function() {
        
        return new Kinaj.fn.init();
    },
    
    ajax: function(opts) {
        
        var options = $.extend( Kinaj.defaults.ajaxSetup, opts);
        
        $.ajax(options);

    }
	
};


Kinaj.fn.init.prototype = Kinaj.fn;


// Kinaj.Showroom object
Kinaj.Showroom = function( container , opts ) {
    
    this.container = container;
    
    this.load(this);
    
};


Kinaj.Showroom.prototype = {
    
	_leftLink: function( list ) {
		var leftLink = $( '<a />' ).attr({
						href: '#',
						title: 'left',
						id: 'left'
					})
					.append($( '<img />').attr( {
						src: '/static/img/arrow_left.png',
						title: 'left',
						alt: 'left'
					}))
					.bind('click', function(event) {
						
						if ( showroom.page > 0 ) {
							var curr1 = $('div.visible:eq(1)', list);
							var curr3 = $('div.visible:eq(3)', list);
							
							$(curr1)
								.removeClass('visible')
								.animate({opacity: 0}, 200)
								.prev()
								.prev()
								.animate({opacity: 1}, 200)
								.addClass('visible');
							
							if (curr3.length) {
								$(curr3)
									.removeClass('visible')
									.animate({opacity: 0}, 200)
									.prev()
									.prev()
									.animate({opacity: 1}, 200)
									.addClass('visible');	
							} else {
								$('div.visible:eq(2)', list)
									.prev()
									.animate({opacity: 1}, 200)
									.addClass('visible');
							}
							
							$(list).animate({left: '+=12.4em'}, 350, 'swing');
							
							showroom.page -= 1;
						}
						
						if ( showroom.page === 0 ) {
							
							$(this).css('opacity', 0)
						}
						
						if ( showroom.page < showroom.pages ) {
							
							$('a#right', showroom.container).css('opacity', 1);
						}
						
						return false;
					})
					.css('opacity', 0);
					
		return leftLink;
	},
	
	_rightLink: function( list ) {
		var rightLink = $( '<a />').attr({
						href: '#',
						title: 'right',
						id: 'right'
					})
					.append($( '<img />').attr({
						src: '/static/img/arrow_right.png',
						title: 'right',
						alt: 'right'
					}))
					.bind('click', function(event) {
						
						if ( showroom.page < showroom.pages ) {
							
							$('div.visible:eq(0)', list)
								.removeClass('visible')
								.animate({opacity: 0}, 200)
								.next()
								.next()
								.animate({opacity: 1}, 200)
								.addClass('visible');
							
							$('div.visible:eq(2)', list)
								.removeClass('visible')
								.animate({opacity: 0}, 200)
								.next()
								.next()
								.animate({opacity: 1}, 200)
								.addClass('visible');	
							
							$(list).animate({left: '-=12.4em'}, 350, 'swing');
							
							showroom.page += 1;
						}
						
						if ( showroom.page === showroom.pages ) {
							
							$(this).css('opacity', 0)
						}
						
						if ( showroom.page > 0 ) {
							
							$('a#left', showroom.container).css('opacity', 1);
						}
						
						return false;
					});
		
		return rightLink;
	},
	
    load: function() {
        
		var self = this;
		
		if (!window.showroom) {
			
			Kinaj.fn.ajax({
				url: '/projects/list/',
				dataFilter: function( data , type ) {
					
					if ( type == "json" )
						data = $.parseJSON(data);
					
					var all = {};
					var allArr = [];
					var active = [];
					var featured = [];
					
					for (var i = data.length - 1; i >= 0; i--) {
						
						all[data[i]['id']] = data[i];
						allArr.push(data[i]);
						
						if (data[i]['featured']) {
							
							featured.push(data[i]);
							
						} else {
						
							active.push(data[i]);
							
						}
						
					};
					
					data = {};
					data['all'] = all;
					data['allArr'] = allArr;
					data['active'] = active;
					data['featured'] = featured;
					
		            return data;
					
		        },
	            success: function( data , status ) {
					
					var active = data['active'];
					var featured = data['featured'];
					var llength = Math.round( active.length /2 );	
					
					
					showroom = window.showroom = {
						container: self.container,
						pages: llength -2,
						page: 0,
						all: data['all'],
						allArr: data['allArr'],
						active: active,
						featured: featured
					};
					
					$.extend(self, showroom);
					$.extend(showroom, self);
					
					self.list();
	            }
        	});
			
		} else {
			self.list();
		}
        
    },
	
	list: function() {
		
		var self = this;
		
		$(self.container)
		    .css('opacity', 0)
		    .attr('id', 'project_list');
		    
		showroom['page'] = 0;
		
		var active = self.active;
		var llength = Math.round( active.length /2 );
		
		var fp = self.featured[0];
		
		var fimg = $( '<img />').attr({
				alt: fp.name,
				src: '/static/projects/' + fp.id + '/' + fp.preview_big,
				title: fp.name
			});
		var flink = $( '<a />').attr({ 
				href: '/projects/retrieve/' + fp.id,
				title: fp.name
			}).append(fimg);
				
		var fproject = $( '<div />').attr({ 
				id: fp.id
			})
			.addClass('project visible')
			.append(flink);
		var featured = $( '<div />').attr({
				id: 'featured'
			})
			.append( fproject );
		
		var list = $( '<div />').attr({
				id: 'list'
			})
			.css({
				width: (active.length  * 7.5) + 'em'
			});
		
		for ( var i = 0; i < active.length; i++ ) {
			
			var p = active[i];
			
			var img = $( '<img />').attr({
				alt: p.name,
				src: '/static/projects/' + p.id + '/' + p.preview_small,
				title: p.name
			});
			var link = $( '<a />').attr({ 
				href: '/projects/retrieve/' + p.id,
				title: p.name
			}).append(img);
				
			var div = $( '<div />').attr({ 
					id: p.id
				})
				.addClass('project')
				.append(link);
			
			$(list).append(div);
			
		}
		
		$('div.project:first', list)
			.addClass('visible')
			.next()
			.addClass('visible');
			
		$('div.project:eq(' + ( llength ) + ')', list)
			.addClass('visible')
			.next()
			.addClass('visible');
			
		$('div.project:not(.visible)', list).css( 'opacity' , '0' );
		
		var leftLink = self._leftLink(list);
		var rightLink = self._rightLink(list);
		
		$(self.container)
			.empty()
			.append(leftLink)
			.append(featured)
			.append(list)
			.append(rightLink)
			.css('display', 'block')
			.stop()
			.animate({opacity: 1}, 1000);
		
		$('div.project', self.container).bind('click', function(event) {
			
			if ( $(this).hasClass('visible') )
			    self.single( this.id );
			
			return false;
		});
			
	},
	
	single: function( project ) {
		
		var self = this;
		var converter = new Showdown.converter();
		
		var current = self['current'] = self.all[project];
		
		$.each(self.allArr, function(idx) {
            if (self.allArr[idx]['_id'] === current['_id'])
                showroom.next = idx +1;
		});
		
		current.text = converter.makeHtml(current.text);
		
		var tmpl = '<div id="<%= _id %>">'
		         + '<a href="/" class="back"><img src="/static/img/back.png" title="back" alt="back" /></a>'
		         + '<div class="preview"><img src="/static/projects/<%= _id %>/<%= preview_big %>" /></div>'
		         + '<div class="info">'
		         + '<h1><%= name %></h1>'
		         + '<span class="category"><%= category %></span>'
		         + '<div><%= text %></div>'
		         + '<% if (download_mac.length && download_pc.length) %>'
		         + '<p class="download">Download for <a href="/static/projects/<%= _id %>/<%= download_mac %>">Mac</a> or <a href="/static/projects/<%= _id %>/<%= download_pc %>">PC</a></p>'
		         + '<% if (download_mac.length && !download_pc.length) %>'
		         + '<p class="download"><a href="/static/projects/<%= _id %>/<%= download_mac %>">Download</a></p>'
		         + '<% if (download_pc.length && !download_mac.length) %>'
		         + '<p class="download"><a href="/static/projects/<%= _id %>/<%= download_pc %>">Download</a></p>'
		         + '</div>'
		         + '</div>';
		         
		var infoTmpl = '<h1><%= name %></h1>'
 		             + '<span class="category"><%= category %></span>'
 		             + '<div><%= text %></div>'
 		             + '<% if (download_mac.length && download_pc.length) %>'
 		             + '<p class="download">Download for <a href="/static/projects/<%= _id %>/<%= download_mac %>">Mac</a> or <a href="/static/projects/<%= _id %>/<%= download_pc %>">PC</a></p>'
 		             + '<% if (download_mac.length && !download_pc.length) %>'
 		             + '<p class="download"><a href="/static/projects/<%= _id %>/<%= download_mac %>">Download</a></p>'
 		             + '<% if (download_pc.length && !download_mac.length) %>'
 		             + '<p class="download"><a href="/static/projects/<%= _id %>/<%= download_pc %>">Download</a></p>';
		
		var html = $( $.srender( tmpl , current ) )
		    .find( 'a.back' )
		    .bind( 'click' , function(event) {
                self.load()
		        
		        return false;
		    })
		    .end()
		    .find('div.preview')
		    .css('cursor', 'pointer')
		    .bind('click', function(event) {
		        var next = self.allArr[showroom.next];
		        $('img', this)
		            .css('opacity', 0)
		            .attr('src', '/static/projects/' + next._id + '/' + next.preview_big )
		            .animate({opacity: 1}, 1000);
		        
		        next.text = converter.makeHtml(next.text);
		        
		        $('div.info', self.container)
		            .css('opacity', 0)
		            .html( $.srender(infoTmpl, next))
		            .stop()
		            .animate({opacity: 1}, 1000);
		        
		        showroom.next++;
		        
		        if (showroom.next === self.allArr.length)
		            showroom.next = 0;
		        
		        return false;
		    })
		    .end();
		    
		$(self.container)
		    .css('opacity', 0)
		    .children()
		    .remove();
		
		$(self.container)
		    .attr('id', 'single_project')
		    .append(html)
		    .stop()
		    .animate({opacity: 1}, 1000);
		
	}
      
};
    
})(jQuery);