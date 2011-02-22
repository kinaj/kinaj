var express = require('express')
  , app = module.exports = express.createServer();

// configuration
app.configure(function() {
  app.set('views', __dirname + '/views')
  app.set('view engine', 'jade')
  app.use(express.bodyDecoder())
  app.use(express.methodOverride())
  app.use(express.cookieDecoder())
  app.use(express.session({ secret: 'your secret here' }))
  app.use(express.compiler({ src: __dirname + '/public', enable: [ 'less' ] }))
  app.use(app.router)
  app.use(express.staticProvider(__dirname + '/public'))
})
app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }))
})
app.configure('test', function() {})
app.configure('production', function(){
  app.use(express.errorHandler())
})

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
    console.log("Express server listening on port %d", app.address().port)
  })
}
