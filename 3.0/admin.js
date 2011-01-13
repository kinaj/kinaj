var Ordnung     = require('ordnung').Ordnung
  , middleware  = require('./middleware')
  , mixins      = require('./mixins')
  , config      = require('./config')
  , base        = require('./admin/base')
  , auth        = require('./admin/auth')
  , projects    = require('./admin/projects')
  , attachments = require('./admin/attachments')

var app = new Ordnung({ name: 'kinaj/admin', port: 3001 })

app.defaultHandler = mixins.notFound
app.mixin({ mixins: { res: { redirect: mixins.redirect
                           , simple: mixins.simple
                           , template: mixins.template
                           , notFound: mixins.notFound
                           , static: mixins.static
                           }
                    }
          })
app.middlewares = [ middleware.logger
                  , middleware.context
                  , middleware.responseTime
                  , middleware.xhr
                  , middleware.form
                  , middleware.cookies
                  , middleware.session
                  , middleware.flash
                  , middleware.authorization
                  ]
app.mapRoutes([
              // base route
                [ [ 'get' ],    '/',        auth.prot(base.dashboard) ]
              
              // auth
              , [ [ 'get' ],    '/login', auth.loginForm ]
              , [ [ 'post' ],   '/login', auth.login ]
              , [ [ 'delete' ], '/login', auth.logout ]

              // projects
              , [ [ 'get' ],    '/projects',              auth.prot(projects.list) ]
              , [ [ 'post' ],   '/projects/create',       auth.prot(projects.create) ]
              , [ [ 'put' ],    '/projects/:slug/update', auth.prot(projects.update) ]
              , [ [ 'delete' ], '/projects/:slug/delete', auth.prot(projects.del) ]
              // projects attachments
              , [ [ 'get' ],    '/projects/:slug/attachments/:filename',  auth.prot(mixins.static)  ]
              , [ [ 'post' ],   '/projects/:slug/attachments/set',        auth.prot(attachments.set) ]
              // projects forms
              , [ [ 'get' ],    '/projects/new',          auth.prot(projects.newForm) ]
              , [ [ 'get' ],    '/projects/:slug/edit',   auth.prot(projects.editForm) ]
              ])
app.listen()
