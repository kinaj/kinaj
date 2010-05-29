jQuery(function($) {
    
    $('div#message').text('rdy');
    
    
    $('div#page')
    .bind('dragover', function(event,  data) {
        
        event.stopPropagation();
        event.preventDefault();
        
        $('div#message').text('drop');
    
    })
    .bind('drop', function(event, data) {
    
        event.stopPropagation();
        event.preventDefault();
        
        uri = event.originalEvent.dataTransfer
            .getData("text/uri-list")
            .replace(/%20/g, ' ')
            .replace(/%7C/g, '|');
        
        if (!uri.match('file://localhost'))
            return alert('Error');
            
        var path = uri.substring(16, uri.length);
        
        setTimeout(function() { uploadFile(path); }, 100);
        
        $('div#message').text('upldr...');
        
    });
    
});

function uploadFile(path){
	com = '/usr/bin/curl -u kinaj:blub -X POST http://kinaj.com/u/ -F file="@' + path + '"'
	widget.system(com, uploadComplete);
}

function uploadComplete(com)
{
    var result = $.parseJSON(com.outputString);
    
    alert(result.url);
    
    if (result.url) {
        
        widget.system("/bin/echo -n '" + result.url + "' | pbcopy", null);	
		var growlcmd = 'osascript growl/growl.scpt "' + result.url + '" "'+ uri +'"';
		widget.system(growlcmd, null);
        
        $('div#message').text('done');
        
        setTimeout(function() { $('div#message').text('rdy'); }, 3500);
    }
}