var mongoose = require('mongoose')
  , Schema = mongoose.Schema
  , Project

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
