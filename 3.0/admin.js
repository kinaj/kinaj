var Ordnung = require('ordnung').Ordnung
  , middleware = require('./middleware')
  , mixins = require('./mixins')
  , admin = require('./lib/admin');

Ordnung.prototype.middleware = [ middleware.logger
                               , middleware.responseTime
                               , middleware.form
                               , middleware.cookies
                               , middleware.session
                               , middleware.flash
                               , middleware.authorization
                               ];

Ordnung.prototype.response.mixin({ template: mixins.template });

var app = new Ordnung({ name: 'kinaj/admin', port: 3001 });

app.mapRoutes([ [ [ 'get' ],      '/',        admin.dashboard, true ]
              , [ [ 'get' ],      '/login',   admin.loginForm ]
              , [ [ 'post' ],     '/login',   admin.login ]
              , [ [ 'delete' ],   '/login',   admin.logout ]

              // TODO remove only for testing
              , [ [ 'get' ],      '/logout',  admin.logout ]
              ]);

app.start();
