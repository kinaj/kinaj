var fs = require('fs')
  , Buffer = require('buffer').Buffer
  , mongo = require('mongodb')
  , config = require('../config')
  , helper = require('../helper')
  , srv = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {})
  , db = new mongo.Db('kinaj', srv, {})
  , chunkSize = (1024 * 1024 * 1);

exports.create = function(req, res, params) {
  var file = params.files.attachment
    , originalPath = config.uploadDir + '/attachment/' + file.filename;

  helper.moveFile(file.path, originalPath, function() {
    db.open(function(err, db) {
      if (err) throw err;

      var gridStore = new mongo.GridStore(db, file.filename, 'w', {
        'content_type': file.mime,
        'metadata': { originalPath: originalPath },
        'chunk_size': chunkSize,
        'root': 'attachments'
      });

      gridStore.open(function(err, gridStore) {
        if (err) throw err;

        console.log('gridStore open');

        fs.open(originalPath, 'r+', process.O_RDONLY, function(err, fd) {
          if (err) throw err;

          function read() {
            var buf = new Buffer(chunkSize);

            fs.read(fd, buf, 0, chunkSize, null, function(err, bytesRead) {
              if (err) throw err;

              if (bytesRead > 0) {
                gridStore.write(buf, function(err, gridStore) {
                  read();
                });
              } else {
                gridStore.close(function(err, result) {
                  if (err) throw err;

                  console.dir(result);

                  res.simple(200, 'ok', {});

                  db.close();
                });
              }
            });
          };

          read();
        });
      });
    });
  });

  console.dir(params.files);
};
