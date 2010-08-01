var sys = require('sys')
  , User = require('../models').User
  , ins = function(x) { return sys.debug(sys.inspect(x)); };

exports.loginForm = function(req, res, params) {
  var action = '/login';

  if (params.query.redirect)
    action += '?redirect=' + params.query.redirect;

  res.template(200, {}, 'admin/auth-login.html', {
    action: action
  });
};

exports.login = function(req, res, params) {
  var username = params.fields.username
    , password = params.fields.password;

  User.validPassword(username, password, function(check, uid) {
    if (check) {
      params.session.store(uid, username, function() {
        res.redirect(params.query.redirect || '/');
      });
    } else {
      params.flash.push('wrong credentials', function() {
        res.redirect('/login');
      });
    }
  });
};

exports.logout = function(req, res, params) {
  var redirect = '/login';

  params.session.destroy(function() {
    if (params.xhr) {
      res.simple(200, { redirect: redirect }, {});
    } else res.redirect(redirect);
  });
};
