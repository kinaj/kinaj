var fs = require('fs')
  , Buffer = require('buffer').Buffer
  , mongo = require('mongodb')
  , config = require('./config')
  , srv = new mongo.Server(config.mongo.serverAddress, config.mongo.serverPort, {})
  , db = new mongo.Db(config.mongo.database, srv, {})
  , chunkSize = (1024 * 1024 * 1);

exports.get = function(filename, cb) {
  db.open(function(err, db) {
    if (err) throw err;

    mongo.GridStore.read(db, filename, 2019636, 0, {
      'root': 'attachments'
    }, function(err, data) {
      var file = new Buffer(data, 'ascii');
      console.dir(err);
      console.log(typeof file);
      console.log(file.length);

      db.close(function() {
        console.log('db close');
      });

      cb(file);
    });
  });
  // db.open(function(err, db) {
  //   if (err) throw err;

  //   var gs = new mongo.GridStore(db, filename, 'r');

  //   gs.open(function(err, gs) {
  //     console.dir(gs);

  //     cb('');
  //   });
  // });
};

exports.store = function(file, metadata, root, cb) {
  db.open(function(err, db) {
    if (err) throw err;

    var gs = new mongo.GridStore(db, file.filename, 'w', {
      'content_type': file.mime,
      'metadata': metadata,
      'chunk_size': chunkSize,
      'root': root
    });

    gs.open(function(err, gs) {
      if (err) throw err;

      fs.open(file.path, 'r+', process.O_RDONLY, function(err, fd) {
        if (err) throw err;

        function read() {
          var buf = new Buffer(chunkSize);

          fs.read(fd, buf, 0, chunkSize, null, function(err, bytesRead) {
            if (err) throw err;

            if (bytesRead > 0) {
              gs.write(buf, function(err, gs) {
                read();
              });
            } else {
              gs.close(function(err, result) {
                if (err) throw err;

                cb();

                db.close();
              });
            }
          });
        };

        read();
      });
    });
  });
};
