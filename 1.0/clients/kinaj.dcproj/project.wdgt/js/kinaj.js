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
        xhr: function(){
            
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
    
})(jQuery);