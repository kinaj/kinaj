/*
 * Kinaj
 * version: 0.3
 * @requires jQuery v1.3.1 or later
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
        contentType: 'application/x-www-form-urlencoded',
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

    },
	
	/*
	 * This function returns an dom object with the attributes given.
	 * 
	 * @param (String) el The name of the element.
	 * @param (Object) attr Dictionary with attributes to map.
	 * 
	 */
	elWithAttr: function( el , attr ) {
		
		var el = $(document.createElement( el ));
		
		$(el).attr( attr );
            
		return el;
	}
	
};


Kinaj.fn.init.prototype = Kinaj.fn;


// Kinaj.Showroom object
Kinaj.Showroom = function( container , opts ) {
    
    this.container = container;
    
    this.load(this);
    
};


Kinaj.Showroom.prototype = {
    
    load: function(ins) {
        
        Kinaj.fn.ajax({

            url: '/projects/list/',
			dataFilter: function( data , type ) {
				
				if ( type == "json" )
					data = JSON.parse(data);
				
				var active = [];
				var featured = [];
				
				for (var i = data.length - 1; i >= 0; i--) {
					
					if (data[i]['featured']) {
						
						featured.push(data[i]);
						
					} else {
					
						active.push(data[i]);
						
					}
					
				};
				
				data = {};
				data['active'] = active;
				data['featured'] = featured;
				
	            return data;
				
	        },
            success: function( data , status ) {
				
				$('div.project', ins.container)
					.live('click', function(event) {
						
						return false;
					})
					.css( 'cursor' , 'pointer' );
				
				var active = data['active'];
				var featured = data['featured'];
				
				var list = $('div#list', ins.container);
				
				var llength = Math.round( active.length /2 );
				
				$('div#mainlist', ins.cotainer)
					.css( 'display' , 'none' )
					.remove();
				
				$(list)
					.css({
						display: 'none',
						width: (active.length  * 7.5) + 'em'
					})
					.empty();
				
				for ( var i = 0; i < active.length; i++ ) {
					
					var p = active[i];
					
					var img = Kinaj.fn.elWithAttr( 'img' , {
						alt: p.name,
						src: '/static/projects/' + p.id + '/' + p.preview_small,
						title: p.name
					});
					var link = Kinaj.fn.elWithAttr( 'a', { 
						href: '/projects/retrieve/' + p.id,
						title: p.name
					}).append(img);
						
					var div = Kinaj.fn.elWithAttr( 'div' , { 
							id: p.id
						})
						.addClass('project')
						.css( 'cursor' , 'pointer' )
						.append(link);
					
					$(list).append(div);
					
				}
				
				$('div.project:first', list)
					.addClass('visible')
					.next()
					.addClass('visible');
					
				$('div.project:eq(' + ( llength +1 ) + ')')
					.addClass('visible')
					.next()
					.addClass('visible');
					
				$('div.project:not(.visible)', list).css( 'opacity' , '0' );
				
				
				var leftLink = Kinaj.fn.elWithAttr( 'a' , {
						href: '#',
						title: 'left',
						id: 'left'
					})
					.append(Kinaj.fn.elWithAttr( 'img' , {
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
							
							$('a#right', ins.container).css('opacity', 1);
						}
						
						return false;
					})
					.css('opacity', 0);
				
				var rightLink = Kinaj.fn.elWithAttr( 'a' , {
						href: '#',
						title: 'right',
						id: 'right'
					})
					.append(Kinaj.fn.elWithAttr( 'img' , {
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
							
							$('a#left', ins.container).css('opacity', 1);
						}
						
						return false;
					});
				
				
				
				$(ins.container)
					.prepend(leftLink)
					.append(rightLink);
				
				$(list)
					.css( 'display' , 'block' );
				
				window.showroom = {
					pages: llength -2,
					page: 0,
					active: active,
					featured: featured
				};
            }

        });
        
    }
      
};
    
})(jQuery);