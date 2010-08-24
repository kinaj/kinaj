var config = require('../config')
  , helper = require('../helper')
  , gridfs = require('../gridfs');

exports.get = function(req, res, params) {
  gridfs.get(params.filename, function(file) {
    res.simple(200, file, { 'content-type': 'image/jpeg' });
  });
};
exports.create = function(req, res, params) {
  var file = params.files.attachment
    , targetPath = config.uploadDir + '/attachment/' + file.filename;

  helper.moveFile(file.path, targetPath, function() {
    file.path = targetPath;

    gridfs.store(file, {
      'originalPath': file.path,
      'projectSlug': params.slug
    }, 'attachments', function() {
      res.simple(200, 'ok', {});
    });
  });
};
