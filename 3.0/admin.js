var sys = require('sys')
  , config = require('./config')
  , middleware = require('./middleware')
  , Ordnung = require('ordnung').Ordnung
  , mu = require('mu')
  , admin = require('./lib/admin')
  , ins = function(x) { return sys.debug(sys.inspect(x)); };


// path to mu template directory
mu.templateRoot = config.viewDir;

// add middlewares
Ordnung.prototype.middleware = [ middleware.logger
                               , middleware.responseTime
                               , middleware.form
                               , middleware.cookies
                               , middleware.session
                               , middleware.authorization
                               ];

Ordnung.prototype.response.mixin({
  template: function(status, hdrs, tmpl, ctx) {
    var self = this;

    mu.render(tmpl, ctx, {}, function(err, out) {
      if (err) throw err;

      var res = '';

      out.addListener('data', function(chunk) { res += chunk; });
      out.addListener('end', function() {
        self.simple(status, res, { 'content-type': 'text/html' });
      });
    });
  }
});

var app = new Ordnung({ name: 'kinaj/admin', port: 3001 });

app.mapRoutes([ [ [ 'get' ],      '/',        admin.dashboard, true ]
              , [ [ 'get' ],      '/login',   admin.loginForm ]
              , [ [ 'post' ],     '/login',   admin.login ]
              , [ [ 'delete' ],   '/login',   admin.logout ]

              // TODO remove only for testing
              , [ [ 'get' ],      '/logout',  admin.logout ]
              ]);

app.start();
