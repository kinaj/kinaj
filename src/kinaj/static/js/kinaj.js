(function($) {
    $.fn.kinaj = function(options) {
        
        var opts = $.extend({}, $.fn.kinaj.defaults, options);
        
        return this.each(function(idx) {
            new Kinaj(this);
        });
        
    };
    
    $.fn.kinaj.defaults = {
        
    };
    
    
    var Kinaj = function(container) {
        this.container = container;

        this.init();
    };

    Kinaj.prototype = {
        init: function() {
            var instance = this;
            $(instance.container).empty();
            
            instance.db.list(instance);
        },
    };
    
    Kinaj.prototype.db = {
        list: function(ins) {
            $.ajax({
                url: '/projects/list/',
                type: 'get',
                dataType: 'json',
                success: function(response) {
                    ins.interface.list(ins, response)
                }
            });
        }
    };
    
    Kinaj.prototype.interface = {
        list: function(ins, projectsList) {
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