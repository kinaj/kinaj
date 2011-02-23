var crypto = require('crypto')
  , mongoose = require('mongoose')
  , helpers = require('./helpers')
  , Schema = mongoose.Schema
  , algo = 'sha512'
  , hmacKey = 'com.kinaj.api'
  , Project, User

Project = new Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true },
  tags: [ String ],
  description: String,
  created: Date,
  updated: { type: Date, default: Date.now }
})
Project.virtual('id').get(function() {
  return this._id.toHexString()
})
Project.pre('save', function(next) {
  if(this.isNew) {
    this.created = new Date()
  }

  next()
})

exports.Project = Project

function passwordHash(value, salt) {
  var salt = salt || helpers.uuid().substr(0, 6)
    , hash = crypto.createHmac(algo, hmacKey).update([ salt, value ].join('')).digest('base64')

  return [ algo, salt, hash ].join('$')
}
function validatePassword(email, password, fn) {
  var self = this

  this.findOne({ email: email }, function(err, user) {
    if(err) throw err

    if(user) {
      var salt = user.password.split('$')[1]
        , ret = (self.passwordHash(password, salt) === user.password)

      fn(ret, user)
    } else {
      fn(false, null)
    }
  })
}

User = new Schema({
  email: {
    type: String,
    index: { unique: true },
    required: true
  },
  password: { type: String, required: true, set: passwordHash },
  created: Date,
  updated: { type: Date, default: Date.now }
})
User.static('passwordHash', passwordHash)
User.static('validatePassword', validatePassword)
User.pre('save', function(next) {
  if(this.isNew) {
    this.created = new Date()
  }

  next()
})

exports.User = User
