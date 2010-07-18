var sys = require('sys')
  , User = require('../models').User
  , ins = function(x) { return sys.debug(sys.inspect(x)); };

exports.dashboard = function(req, res, params) {
  res.template(200, {}, 'dashboard.html', {
    username: params.session.username
  });
};

exports.loginForm = function(req, res, params) {
  var action = '/login';

  if (params.query.redirect)
    action += '?redirect=' + params.query.redirect;

  res.template(200, {}, 'login-form.html', {
    action: action
  });
};

exports.login = function(req, res, params) {
  var username = params.fields.username
    , password = params.fields.password;

  User.validPassword(username, password, function(check, uid) {
    if (check) {
      params.flash.push('Aloha, ' + username, function() {
        res.redirect(params.query.redirect || '/');
      });

      params.session.store(uid, username);
    } else {
      params.flash.push('wrong credentials', function() {
        res.redirect('/login');
      });
    }
  });
};

exports.logout = function(req, res, params) {
  params.session.destroy(function() {
    res.redirect('/login');
  });
};
