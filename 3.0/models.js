require('./models/user');

var mongoose = require('mongoose/mongoose').Mongoose
  , db = mongoose.connect('mongodb://127.0.0.1/kinaj');
  
exports.User = db.model('User');
