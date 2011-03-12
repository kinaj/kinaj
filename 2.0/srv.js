var path      = require( 'path' );
var paperboy  = require( 'paperboy' );
var srv       = new( require( 'http' ).Server );
var PORT      = 8080;
var HOST      = '0.0.0.0';

srv.on( 'request', function ( req, res ) {
  var ip = req.connection.remoteAddress;

  paperboy
    .deliver( path.join( __dirname, 'static' ), req, res)
    .addHeader( 'Expires', 0 )
    .after( function ( statCode ) {
      log( statCode, req.url, ip );
    })
    .error(function ( statCode, msg ) {
      res.writeHead( statCode, { 'content-type': 'text/plain' } );
      res.end( 'error ' + statCode );

      log( statCode, req.url, ip, msg );
    })
    .otherwise( function ( err ) {
      res.writeHead( 404, { 'content-type': 'text/plain' } );
      res.end( 'Error 404: File not found' );

      log( 404, req.url, ip, err );
    });
});

srv.listen(PORT, HOST, function () {
  console.log( 'Server listening on %s:%d', HOST, PORT);
});


function log ( statCode, url, ip, err ) {
  var logStr = '%d - %s - %s';

  if ( err ) {
    logStr += ' - %s';
  }

  console.log( logStr, statCode, url, ip, err );
};
