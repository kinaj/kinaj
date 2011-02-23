var express = require('express')
  , mongoose = require('mongoose')
  , models = require('./models')
  , app = module.exports = express.createServer()
  , db, Project

// configuration
app.configure('development', function(){
  app.set('mongodb', 'mongodb://localhost:27017/kinaj-development')
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})
app.configure('test', function() {
  app.set('mongodb', 'mongodb://localhost:27017/kinaj-test')
})
app.configure('production', function(){
  app.set('mongodb', 'mongodb://localhost:27017/kinaj-production')
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
app.db = db = mongoose.connect(app.set('mongodb'))

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

app.get('/projects', function(req, res) {
  Project.find({}, function(err, projects) {
    if(err) throw err

    res.send(projects.map(function(p) { return p.toObject() }))
  })
})
app.post('/projects', function(req, res) {
  var project = new Project(req.body)
  
  project.save(function(err) {
    if(err) throw err

    res.send(project.toObject())
  })
})
app.put('/projects/:slug', function(req, res) {
  Project.findOne({ slug: req.param('slug') }, function(err, project) {
    Object.keys(req.body).forEach(function(key, i) {
      project[key] = req.body[key]
    })

    project.save(function(err) {
      if(err) throw err

      res.send(project.toObject())
    })
  })
})
app.del('/projects/:slug', function(req, res) {
  Project.findOne({ slug: req.param('slug') }, function(err, project) {
    if(err) throw err

    project.remove(function(err) {
      if(err) throw err

      res.send({ ok: true })
    })
  })
})

// Only listen on $ node app.js
if(!module.parent) {
  app.listen(3000, function() {
    console.log("PORT: %d ENV: %s", app.address().port, app.settings.env)
  })
}
