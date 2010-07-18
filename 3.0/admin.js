var sys = require('sys')
  , Ordnung = require('ordnung').Ordnung
  , middleware = require('./middleware')
  , mixins = require('./mixins')
  , config = require('./config')
  , auth = require('./admin/auth')
  , projects = require('./admin/projects')
  , paperboy = require('paperboy');


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

// static delivery in development
if (process.env['RUNTIME'] === 'development')
  app.route([ 'get' ],/^\/static/, function(req, res, params) {
    paperboy
      .deliver(config.baseDir, req, res)
      .addHeader('Expires', -1)
      .addHeader('X-PaperRoute', 'kinaj/admin')
      .otherwise(function(err) {
        res.simple(500, err.stack, {});
      });
  });

app.mapRoutes([ [ [ 'get' ],      '/',        auth.dashboard, true ]
              
              // auth
              , [ [ 'get' ],      '/login',   auth.loginForm ]
              , [ [ 'post' ],     '/login',   auth.login ]
              , [ [ 'delete' ],   '/login',   auth.logout ]


              // projects
              , [ [ 'get' ],      '/projects',              projects.list, true ]
              , [ [ 'post' ],     '/projects/create',       projects.create, true ]
              , [ [ 'put' ],      '/projects/:slug/update', projects.update, true ]
              , [ [ 'delete' ],   '/projects/:slug/delete', projects.del, true ]

              // projects forms
              , [ [ 'get' ],      '/projects/new',          projects.newForm, true ]
              , [ [ 'get' ],      '/projects/:slug/edit',   projects.editForm, true ]

              // TODO remove only for testing
              , [ [ 'get' ],      '/logout',  auth.logout ]
              ]);

app.start();
