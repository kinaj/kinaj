var sys = require('sys')
  , crypto = require('crypto')
  , helper = require('./helper')
  , mongoose = require('mongoose').Mongoose
  , db = mongoose.connect('mongodb://127.0.0.1/kinaj')
  , algo = 'sha512'
  , hmacKey = 'com.kinaj.admin';
  
function passwordHash(password, salt) {
  var salt = salt || helper.fastUUID().substr(0, 6)
    , hash = crypto.createHmac(algo, hmacKey).update([ salt, password ].join('')).digest('base64');

  return [ algo, salt, hash ].join('$');
};

mongoose.model('User', {
  properties: [ 'username', 'email', 'password', 'created_at', 'updated_at' ]
, indexes: [ [{ 'username': 1}, {unique: true }] ]
, cast: { 'created_at': Date
        , 'updated_at': Date
        }
, setters: {
    password: function(v) {
      return passwordHash(v);
    }
  }
, methods: {
    passwordHash: passwordHash,
    save: function(fn) {
      this.updated_at = new Date();

      this.__super__(fn);
    }
  }
, static: {
    passwordHash: passwordHash,
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

mongoose.model('Project', {
  properties: [ 'title', 'slug', 'description', 'created_at', 'updated_at' ]
, indexes: [ [{ 'slug': 1}, {unique: true }] ]
, cast: { 'created_at': Date
        , 'updated_at': Date
        }
, methods: {
    save: function(fn) {
      this.updated_at = new Date();
  
      this.__super__(fn);
    }
  }
});

exports.User = db.model('User');
exports.Project = db.model('Project');
