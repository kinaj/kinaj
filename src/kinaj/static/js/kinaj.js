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
		
    },
    
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
				
				var active = data['active'];
				var featured = data['featured'];
				
				var list = $('div#list', ins.container);
				
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
					
					var div = Kinaj.fn.elWithAttr( 'div' , { 
						id: p.id , 
						class: 'project' 
					});
					
					$(div)
						.bind('click', function(event) {
						
							return false;
						})
						.css( 'cursor' , 'pointer' );
					
					var img = Kinaj.fn.elWithAttr( 'img' , {
						alt: p.name,
						src: '/static/projects/' + p.id + '/' + p.preview_small,
						title: p.name
					});
					var link = Kinaj.fn.elWithAttr( 'a', { 
						href: '/projects/retrieve/' + p.id,
						title: p.name
					});
					
					$(link)
						.append(img);
						
						
					$(div).append(link);
					
					$(list).append(div);
					
				}
				
				$('div.project:first', list)
					.addClass('visible')
					.next()
					.addClass('visible');
					
					console.log(Math.round( active.length /2 ) +1)
					
				$('div.project:eq(' + (Math.round( active.length /2 ) +1) + ')')
					.addClass('visible')
					.next()
					.addClass('visible');
					
				$('div.project:not(.visible)', list).css( 'opacity' , '0' );
				
				$(list)
					.css( 'display' , 'block' )
				
            }

        });
        
    }
      
};
    
})(jQuery);