var express = require('express')
  , mongoose = require('mongoose')
  , models = require('./models')
  , app = module.exports = express.createServer()
  , db, Project

// configuration
app.configure('development', function(){
  app.set('mongodb', 'mongodb://localhost/kinaj-development')
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})
app.configure('test', function() {
  app.set('mongodb', 'mongodb://localhost/kinaj-test')
})
app.configure('production', function(){
  app.set('mongodb', 'mongodb://localhost/kinaj-production')
  app.use(express.errorHandler())
})
app.configure(function() {
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyDecoder())
  app.use(express.cookieDecoder())
  app.use(express.session({ secret: 'your secret here' }))
  app.use(express.compiler({ src: __dirname + '/public', enable: [ 'less' ] }))
  app.use(app.router)
  app.use(express.staticProvider(__dirname + '/public'))
})

// declare models
mongoose.model('Project', models.Project)

// database connection
db = mongoose.connect(app.set('mongodb'))

// expose models to app
app.Project = Project = db.model('Project')

// routes
app.get('/', function(req, res){
  res.render('index', {
    locals: {
      title: 'Express'
    }
  })
})

// Only listen on $ node app.js
if(!module.parent) {
  app.listen(3000, function() {
    console.log("PORT: %d ENV: %s", app.address().port, app.settings.env)
  })
}
