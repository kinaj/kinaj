var config = require('../config')
  , helper = require('../helper')
  , Project = require('../models').Project

exports.get = function(req, res, ctx) {
  res.notFound()
};
exports.set = function(req, res, ctx) {
  var file = ctx.files.attachment
    , targetPath = helper.generatePath(config.attachmentDir, ctx.params.slug, file.filename);

  helper.moveFile(file.path, targetPath, function() {
    file.path = targetPath;
    console.dir(file)
    Project.find({ slug: ctx.params.slug }).first(function(project) {
      project.attachments.shift(file)
      project.save(function() {
        if(ctx.xhr)
          res.simple(200, { ok: true }, {})
        else res.simple(200, 'OK', {})
      })
    })
  });
};
