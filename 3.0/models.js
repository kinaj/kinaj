var crypto = require('crypto')
  , mongoose = require('mongoose').Mongoose
  , config = require('./config')
  , helper = require('./helper')
  , db = mongoose.connect(config.mongo.uri)
  , algo = 'sha512'
  , hmacKey = 'com.kinaj.admin';
  
function passwordHash(password, salt) {
  var salt = salt || helper.fastUUID().substr(0, 6)
    , hash = crypto.createHmac(algo, hmacKey).update([ salt, password ].join('')).digest('base64');

  return [ algo, salt, hash ].join('$');
};

mongoose.model('User', {
  properties: [ 'username', 'email', 'password', 'created_at', 'updated_at' ]
, indexes: [ [{ 'username': 1 }, { unique: true }] ]
, cast: { 'created_at': Date
        , 'updated_at': Date
        , 'attachments': Array
        }
, setters: {
    password: function(v) {
      return passwordHash(v);
    }
  }
, methods: {
    passwordHash: passwordHash,
    save: function(fn) {
      if(this.created_at === null) this.created_at = new Date()
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
  properties: [ 'title', 'slug', 'description', 'created_at', 'updated_at', { 'attachments': [ [ 'filename', 'mime', 'path' ] ] }]
, indexes: [ [ { 'slug': 1 }, { unique: true } ] ]
, cast: { 'created_at': Date
        , 'updated_at': Date
        }
, methods: {
    save: function(fn) {
      if(this.created_at === null) this.created_at = new Date()
      this.updated_at = new Date();
  
      this.__super__(fn);
    }
  }
});

exports.User = db.model('User');
exports.Project = db.model('Project');
