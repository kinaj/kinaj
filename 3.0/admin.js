var Ordnung     = require('ordnung').Ordnung
  , middleware  = require('./middleware')
  , mixins      = require('./mixins')
  , config      = require('./config')
  , base        = require('./admin/base')
  , auth        = require('./admin/auth')
  , projects    = require('./admin/projects')
  , attachments = require('./admin/attachments');


var app = new Ordnung({ name: 'kinaj/admin', port: 3001 });

app.middleware = [ middleware.logger
                 , middleware.responseTime
                 , middleware.xhr
                 , middleware.form
                 , middleware.cookies
                 , middleware.session
                 , middleware.flash
                 , middleware.authorization
                 ];
app.res.mixin({ template: mixins.template });
app.mapRoutes([
              // base route
                [ [ 'get' ],    '/',        base.dashboard, true ]
              
              // auth
              , [ [ 'get' ],    '/login',   auth.loginForm ]
              , [ [ 'post' ],   '/login',   auth.login ]
              , [ [ 'delete' ], '/login',   auth.logout ]

              // projects
              , [ [ 'get' ],    '/projects',              projects.list, true ]
              , [ [ 'post' ],   '/projects/create',       projects.create, true ]
              , [ [ 'put' ],    '/projects/:slug/update', projects.update, true ]
              , [ [ 'delete' ], '/projects/:slug/delete', projects.del, true ]
              , [ [ 'post' ],   '/projects/:slug/upload', attachments.create, true ]

              // projects forms
              , [ [ 'get' ],    '/projects/new',          projects.newForm, true ]
              , [ [ 'get' ],    '/projects/:slug/edit',   projects.editForm, true ]
              ]);

app.start()
