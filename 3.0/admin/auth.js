var sys = require('sys')
  , User = require('../models').User
  , ins = function(x) { return sys.debug(sys.inspect(x)); };

exports.prot = function(fn) {
  return function(req, res, params) {
    if(!params.session.uid) {
      params.flash.push('You need to be logged in', function() {
        res.redirect('/login?redirect=' + req.url);
      });
    } else fn.apply(this, arguments)
  }
}

exports.loginForm = function(req, res, ctx) {
  var action = '/login';

  if (ctx.query.redirect)
    action += '?redirect=' + ctx.query.redirect;

  res.template(200, {}, 'admin/auth-login.html', {
    action: action
  });
};

exports.login = function(req, res, ctx) {
  var username = ctx.fields.username
    , password = ctx.fields.password;

  User.validPassword(username, password, function(check, uid) {
    if (check) {
      ctx.session.store(uid, username, function() {
        res.redirect(ctx.query.redirect || '/');
      });
    } else {
      ctx.flash.push('wrong credentials', function() {
        res.redirect('/login');
      });
    }
  });
};

exports.logout = function(req, res, ctx) {
  var redirect = '/login';

  ctx.session.destroy(function() {
    if (ctx.xhr) {
      res.simple(200, { redirect: redirect }, {});
    } else res.redirect(redirect);
  });
};
