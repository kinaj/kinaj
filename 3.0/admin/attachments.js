var config = require('../config')
  , helper = require('../helper')
  , Project = require('../models').Project
  , attachmentDir = config.attachmentDir

exports.set = function(req, res, ctx) {
  var file = ctx.files.attachment
    , slug = ctx.params.slug

  helper.moveAttachment(file, slug, attachmentDir, function(location) {
    file.path = location
    
    Project.find({ slug: slug }).first(function(project) {
      project.attachments.unshift(file)

      project.save(function() {
        if(ctx.xhr)
          res.simple(200, file, {})
        else res.simple(200, 'OK', {})
      })
    })
  })
};
