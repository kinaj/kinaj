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
            console.log(xhr);
        },
        
        complete: function( xhr , status ) {
            console.log(xhr);
            console.log(status);
        },

        dataFilter: function( data , type ) {
            console.log(data);
            console.log(type);
            
            // must return data so following functions can handle it
            return data;
        },
        
        error: function( xhr , status , error ) {
            console.log(xhr);
            console.log(status);
            console.log(error);
        },
        
        success: function( data , status ) {
            console.log(data);
            console.log(status);
        },

        // modify this function for special XMLHttpRequest object creation
        xhr:function(){
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
};


Kinaj.fn.init.prototype = Kinaj.fn;


// Kinaj.Showroom object
Kinaj.Showroom = function( container , opts ) {
    
    this.container = container;
    
    this.list(this);
    
};


Kinaj.Showroom.prototype = {
    
    list: function(ins) {
        
        Kinaj.fn.ajax({

            url: '/projects/list/',
            type: 'get',
            dataType: 'json',
            success: function( data , status ) {
                
                ins.load( ins , data );
                
            }

        });
        
    },
    
    load: function( ins , projectsList ) {
        
        var l = projectsList;
        var lactive = [];
        var lfeatured = [];
        
        for (var i = l.length - 1; i >= 0; i--){
            if (l[i]['featured'])
                lfeatured.push(l[i]);
                
            lactive.push(l[i]);
        };
        
        console.log(lactive);
        console.log(lfeatured);
        
    }
      
};
    
})(jQuery);