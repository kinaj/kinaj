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

exports.projectFixtures = function(app) {
  var projects = [ 
    { title: 'first', slug: 'first', description: 'first description' },
    { title: 'second', slug: 'second', description: 'second description' },
    { title: 'third', slug: 'third', description: 'third description' }
  ]

  projects.forEach(function(p, i) {
    new app.Project(p).save(function(err) {
      if(err) throw err
    })
  })
}
