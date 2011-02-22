var url = require('url')
  , mongodb = require('mongodb')

exports.dropDatabase = function(dbpath) {
  var config = url.parse(dbpath)
    , db = new mongodb.Db(config.pathname.replace('/', ''), new mongodb.Server(config.hostname, config.port, {}), { native_parser: true })

  db.open(function(err, db) {
    if(err) throw err

    db.dropDatabase(function(err, res) {
      if(err) throw err
    })
  })
}
