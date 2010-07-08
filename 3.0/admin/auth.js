var sys = require('sys')
  , User = require('../models').User
  , ins = function(x) { return sys.debug(sys.inspect(x)); };

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
      params.flash.push('Hej, ' + username, function() {
        res.redirect('/');
      });

      params.session.store(uid, username);
    } else {
      params.flash.push('incorrect credentials', function() {
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
