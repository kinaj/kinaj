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
        assert.isArray(JSON.parse(res.body))
        assert.notEqual(JSON.parse(res.body).length, 0)
      }
    },
    'POST /projects': {
      topic: function() {
        var body = JSON.stringify({ title: 'foo', slug: 'foo', description: 'foo bar baz', tags: [ 'one', 'two', 'three' ] })
        
        api.request({
          method: 'post',
          path: '/projects',
          headers: { 'content-type': 'application/json' },
          data: body
        }, this.callback)
      },
      'should respond with 200': function(err, res) {
        assert.equal(res.statusCode, 200)
      },
      'should respond with correct content-type': function(err, res) {
        assert.strictEqual(res.headers['content-type'], 'application/json')
      },
      'should respond with created document': function(err, res) {
        assert.include(res.body, '"title":"foo"')
      },
    },
    'PUT /projects/foo': {
      topic: function() {
        var body = JSON.stringify({ description: 'foo bar barz' })
       
        api.request({
          method: 'put',
          path: '/projects/foo',
          headers: { 'content-type': 'application/json', 'content-length': body.length },
          data: body
        }, this.callback)
      },
      'should respond with 200': function(err, res) {
        assert.equal(res.statusCode, 200)
      },
      'should respond with correct content-type': function(err, res) {
        assert.strictEqual(res.headers['content-type'], 'application/json')
      },
      'should respond with updated document': function(err, res) {
        assert.includes(res.body, '"description":"foo bar barz"')
      }
    },
    'DELETE /projects/foo': {
      topic: function() {
        api.request({
          method: 'delete',
          path: '/projects/foo',
        }, this.callback)
      },
      'should respond with 200': function(err, res) {
        assert.equal(res.statusCode, 200)
      },
      'should respond with correct content-type': function(err, res) {
        assert.strictEqual(res.headers['content-type'], 'application/json')
      },
      'should respond with correct JSON': function(err, res) {
        assert.deepEqual(JSON.parse(res.body), { ok: true })
      }
    }
  }).run({ reporter: require('vows/lib/vows/reporters/spec') })
})
