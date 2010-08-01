var fs = require('fs')
  , Buffer = require('buffer').Buffer
  , mongo = require('mongodb')
  , srv = new mongo.Server('localhost', mongo.Connection.DEFAULT_PORT, {})
  , db = new mongo.Db('kinaj', srv, {})
  , chunkSize = (1024 * 1024 * 2)
  , origPath = '/Users/alx/development/workspace/kinaj/3.0/static/uploads/The.Ruby.Programming.Language.Jan.2008.chm';

// mongo.Chunk.DEFAULT_CHUNK_SIZE = chunkSize;

db.open(function(err, db) {
  if (err) throw err;

  var g = new mongo.GridStore(db, 'The.Ruby.Programming.Language.Jan.2008.chm', 'w', {
    'content_type': 'application/x-chm',
    'metadata': { originalPath: origPath },
    'chunk_size': chunkSize,
    'root': 'attachments'
  });

  g.open(function(err, g) {
    fs.open(origPath, 'r+', process.O_RDONLY, function(err, fd) {
      if (err) throw err;

      function read() {
        var buf = new Buffer(chunkSize);

        fs.read(fd, buf, 0, chunkSize, null, function(err, bytesRead) {
          if (err) throw err;

          if (bytesRead > 0) {
            g.write(buf, function(err, g) {
              read();
            });
          } else {
            g.close(function(err, result) {
              if (err) throw err;

              console.log(g.md5);
              console.dir(result);
            });
          }
        });
      };

      read();
    });
  });
});
