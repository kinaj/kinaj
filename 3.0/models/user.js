var sys = require('sys')
  , crypto = require('crypto')
  , mongoose = require('mongoose/mongoose').Mongoose
  , helper = require('../helper')
  , algo = 'sha512'
  , hmacKey = 'com.kinaj.admin';

mongoose.model('User', {
  properties: [ 'username', 'email', 'password', 'updated_at' ]
, indexes: []
, methods: {
    save: function(fn) {
      this.updated_at = new Date();
      this.__super__(fn);
    }
  }
, static: {
    passwordHash: function(password, salt) {
      var salt = salt || helper.fastUUID().substr(0, 6)
        , hash = crypto.createHmac(algo, hmacKey).update([ salt, password ].join('')).digest('base64');

      return [ algo, salt, hash ].join('$');
    },
    validPassword: function(username, password, cb) {
      var self = this;

      this.find({ username: username }).first(function(doc) {
        if (doc) {
          var salt = doc.password.split('$')[1]
            , reference = self.passwordHash(password, salt)
            , ret = (reference === doc.password);
          
          cb(ret, doc._id.toHexString());
        } else return cb(false, null);
      });
    }
  }
});
