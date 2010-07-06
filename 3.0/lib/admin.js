var User = require('../models').User;

exports.dashboard = function(req, res, params) {
  res.template(200, {}, 'dashboard.html', {
    username: params.session.username
  });
};

exports.loginForm = function(req, res, params) {
  res.template(200, {}, 'login-form.html', {});
};

exports.login = function(req, res, params) {
  var username = params.fields.username
    , password = params.fields.password;

  User.validPassword(username, password, function(check, uid) {
    if (check) {
      res.redirect('/');

      params.session.store(uid, username);
    } else res.simple('/login');
  });
};

exports.logout = function(req, res, params) {
  params.session.destroy(function() {
    res.redirect('/login');
  });
};
