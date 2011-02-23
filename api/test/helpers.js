process.env.NODE_ENV = 'test' // correct env variable for tests

var url = require('url')
  , http = require('http')
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
exports.api = {
  host: 'localhost',
  port: 5555,
  request: function(options, callback) {
    var api = this
      , server = this.server
      , req

    if (!server.fd) {
      if (!('__deferred' in server)) {
        server.__deferred = []
      }

      server.__deferred.push(arguments)

      if (!server.__started) {
        server.listen(server.__port = api.port, api.host, function() {
          if (server.__deferred) {
            process.nextTick(function() {
              server.__deferred.forEach(function(args) {
                api.request.apply(api, args)
              })
            })
          }
        })
        server.__started = true
      }

      return
    }

    options.host = this.host
    options.port = this.port
    req = http.request(options)

    req.on('response', function(res) {
      var body = ''

      res.setEncoding('utf8')
      res.on('data', function(chunk) {
        body += chunk
      })
      res.on('end', function() {
        res.body = body

        callback(null, res)
      })
    }).on('error', function(err) {
      callback(err)
    }).end()
  }
}
