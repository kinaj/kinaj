var config = require('../config')
  , helper = require('../helper')
  , Project = require('../models').Project

exports.get = function(req, res, ctx) {
  Project.find({ slug: ctx.params.slug }).first(function(project) {
    var file = project.attachments.filter(function(attachment) {
      return attachment.filename === ctx.params.filename
    }).pop()

    if(!file) return res.notFound(req, res, ctx)

    helper.stat(file.path, function(stats) {
      res.writeHead(200, {
        'content-type': file.mime,
        'content-lenght': stats.size
      })

      fs.createReadStream(file.path,{
          flags: 'r',
          mode: 0600,
          bufferSize: 4 * 1024
        })
        .addListener('data', function(chunk) {
          res.write(chunk)
        })
        .addListener('close', function() {
          res.end()
        })
    })
  })
}

exports.set = function(req, res, ctx) {
  var file = ctx.files.attachment
    , targetPath = helper.generatePath(config.attachmentDir, ctx.params.slug, file.filename);

  helper.moveFile(file.path, targetPath, function() {
    file.path = targetPath;
    Project.find({ slug: ctx.params.slug }).first(function(project) {
      project.attachments.unshift(file)

      project.save(function() {
        if(ctx.xhr)
          res.simple(200, file, {})
        else res.simple(200, 'OK', {})
      })
    })
  });
};
