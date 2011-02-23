process.env.NODE_ENV = 'test' // correct env variable for tests

var url = require('url')
  , mongodb = require('mongodb')
  , app = require('../app')

exports.dropDatabase = function(dbpath, callback) {
  var config = url.parse(dbpath)
    , db = new mongodb.Db(config.pathname.replace('/', ''), new mongodb.Server(config.hostname, config.port, {}), { native_parser: true })

  db.open(function(err, db) {
    if(err) throw err

    db.dropDatabase(function(err, res) {
      if(err) throw err

      db.close()

      callback()
    })
  })
}
exports.applyFixtures = function(callback) {
  var projects = [ 
    { title: 'first', slug: 'first', description: 'first description' },
    { title: 'second', slug: 'second', description: 'second description' },
    { title: 'third', slug: 'third', description: 'third description' }
  ], done = 0

  projects.forEach(function(p, i) {
    new app.Project(p).save(function(err) {
      if(err) throw err

      done++

      if(done === projects.length) {
        callback()
      }
    })
  })
}
