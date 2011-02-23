process.env.NODE_ENV = 'test' // correct env variable for tests

var http = require('http')
  , assert = require('assert')
  , step = require('step')
  , vows = require('vows')
  , app = require('../app')
  , helpers = require('./helpers')
  , api = helpers.api

// preparations
api.server = app

step(function() {
  helpers.dropDatabase(app.set('mongodb'), this)
}, function() {
  helpers.applyFixtures(this)
}, function() {
  // tests
  vows.describe('projects').addBatch({
    'GET /projects': {
      topic: function() {
        api.request({
          method: 'get',
          path: '/projects'
        }, this.callback)
      },
      'should respond with 200': function(err, res) {
        assert.equal(res.statusCode, 200)
      },
      'should respond with correct content-type': function(err, res) {
        assert.strictEqual(res.headers['content-type'], 'application/json')
      },
      'should respond with list of projects': function(err, res) {
        assert.length(JSON.parse(res.body), 3)
      }
    }
  }).run({ reporter: require('vows/lib/vows/reporters/spec') })
})


// exports['cleanup'] = function() {
// }
// exports['fixtures'] = function() {
// }
// 
// // deliver html
// exports['GET /'] = function(){
//   assert.response(app,
//     { url: '/' },
//     { status: 200,
//       headers: { 'content-type': 'text/html; charset=utf-8' }
//     }, function(res){
//       assert.includes(res.body, '<title>Express</title>')
//     })
// }
// 
// // projects
// exports['GET /projects'] = function() {
//   assert.response(app, {
//     method: 'get',
//     url: '/projects',
//     headers: { 'accept': 'application/json' }
//   }, {
//     status: 200,
//     headers: { 'content-type': 'application/json' }
//   }, function(res) {
//     assert.length(JSON.parse(res.body), 3, 'Should return list of projects')
//   })
// }
// 
// exports['POST /projects'] = function() {
//   var body = JSON.stringify({ title: 'foo', slug: 'foo', description: 'foo bar baz', tags: [ 'one', 'two', 'three' ] })
// 
//   assert.response(app, {
//     method: 'post',
//     url: '/projects',
//     headers: { 'accept': 'application/json', 'content-type': 'application/json', 'content-length': body.length },
//     data: body
//   }, {
//     status: 200,
//     headers: { 'content-type': 'application/json' }
//   }, function(res) {
//     assert.includes(res.body, '"title":"foo"', 'Should return created project')
//   })
// }
// 
// exports['PUT /projects/foo'] = function() {
//   var body = JSON.stringify({ description: 'foo bar barz' })
// 
//   assert.response(app, {
//     method: 'put',
//     url: '/projects/foo',
//     headers: { 'accept': 'application/json', 'content-type': 'application/json', 'content-length': body.length },
//     data: body
//   }, {
//     status: 200,
//     headers: { 'content-type': 'application/json' }
//   }, function(res) {
//     assert.includes(res.body, '"description":"foo bar barz"', 'Should return the updated project')
//   })
// }
// 
// exports['DELETE /projects/foo'] = function(beforeExit) {
//   assert.response(app, {
//     method: 'delete',
//     url: '/projects/foo',
//     headers: { 'accept': 'application/json' },
//   }, {
//     status: 200,
//     headers: { 'content-type': 'application/json' }
//   }, function(res) {
//     assert.eql(JSON.parse(res.body), { ok: true }, 'Should acknowledge the deletion')
//   })
// }
