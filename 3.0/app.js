require('./models/user');

var fs = require('fs')
  , sys = require('sys')
  , Buffer = require('buffer').Buffer
  , middleware = require('./middleware')
  , Ordnung = require('ordnung').Ordnung
  , mongoose = require('mongoose/mongoose').Mongoose
  , mu = require('mu')
  , db = mongoose.connect('mongodb://127.0.0.1/kinaj')
  , User = db.model('User')
  , ins = function(x) { return sys.debug(sys.inspect(x)); };


// path to mu template directory
mu.templateRoot = './views/admin';

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

function dashboard(req, res, params) {
  res.template(200, {}, 'dashboard.html', { username: params.session.username });
};

function loginForm(req, res, params) {
  res.template(200, {}, 'login-form.html', {});
};

function login(req, res, params) {
  var username = params.fields.username
    , password = params.fields.password;

  User.validPassword(username, password, function(check, uid) {
    if (check) {
      res.redirect('/');

      params.session.store(uid, username);
    } else res.simple('/login');
  });
};

function logout(req, res, params) {
  params.session.destroy(function() {
    res.redirect('/login');
  });
};

// app is an instance of Ordnung
var app = new Ordnung({ name: 'kinaj/admin', port: 1337 });

app.mapRoutes([ [ [ 'get' ],      '/',        dashboard, true ]
              , [ [ 'get' ],      '/login',   loginForm ]
              , [ [ 'post' ],     '/login',   login ]
              , [ [ 'delete' ],   '/login',   logout ]

              // TODO remove only for testing
              , [ [ 'get' ],      '/logout',  logout ]
              ]);

app.start();
