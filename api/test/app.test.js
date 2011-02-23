// correct env variable for tests
process.env.NODE_ENV = 'test'

var assert = require('assert')
  , app = require('../app')
  , helpers = require('./helpers')

exports['cleanup'] = function() {
  helpers.dropDatabase(app.set('mongodb'))
}
exports['fixtures'] = function() {
  helpers.applyFixtures(app)
}

// deliver html
exports['GET /'] = function(){
  assert.response(app,
    { url: '/' },
    { status: 200,
      headers: { 'content-type': 'text/html; charset=utf-8' }
    }, function(res){
      assert.includes(res.body, '<title>Express</title>')
    })
}

// projects
exports['GET /projects'] = function() {
  assert.response(app, {
    method: 'get',
    url: '/projects',
    headers: { 'accept': 'application/json' }
  }, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  }, function(res) {
    assert.length(JSON.parse(res.body), 3, 'Should return list of projects')
  })
}

exports['POST /projects'] = function() {
  assert.response(app, {
    method: 'post',
    url: '/projects',
    headers: { 'accept': 'application/json' },
    data: JSON.stringify({ title: 'foo', slug: 'foo', description: 'foo bar baz', tags: [ 'one', 'two', 'three' ] })
  }, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

exports['PUT /projects/foo'] = function() {
  assert.response(app, {
    method: 'put',
    url: '/projects/foo',
    headers: { 'accept': 'application/json' },
    data: JSON.stringify({ description: 'foo bar barz' })
  }, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}

exports['DELETE /projects/foo'] = function() {
  assert.response(app, {
    method: 'delete',
    url: '/projects/foo',
    headers: { 'accept': 'application/json' },
  }, {
    status: 200,
    headers: { 'content-type': 'application/json' }
  })
}
