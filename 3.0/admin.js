var Ordnung = require('ordnung').Ordnung
  , middleware = require('./middleware')
  , mixins = require('./mixins')
  , auth = require('./admin/auth');

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

app.mapRoutes([ [ [ 'get' ],      '/',        auth.dashboard, true ]
              , [ [ 'get' ],      '/login',   auth.loginForm ]
              , [ [ 'post' ],     '/login',   auth.login ]
              , [ [ 'delete' ],   '/login',   auth.logout ]

              // TODO remove only for testing
              , [ [ 'get' ],      '/logout',  auth.logout ]
              ]);

app.start();
