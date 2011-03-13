var cluster = require( 'cluster' );
var server  = require( './srv' ).server;
var master  = cluster( server );
var PORT    = 8080;
var HOST    = '127.0.0.1';

master
  .in( 'development' )
    .use( cluster.debug() )
    .use( cluster.logger() )
  .in( 'production' )
    .use( cluster.logger( '/var/log/kinaj') )
  .in( 'all' )
    .use( cluster.stats() )
    .use( cluster.repl( 8888 ) )
    .listen(PORT, HOST, function () {
      console.log( 'Server listening on %s:%d', HOST, PORT);
    });

