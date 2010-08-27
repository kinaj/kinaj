var nun = require('nun')
  , config = require('./config');

exports.redirect = function(location) {
  this.writeHead(302, { 'Location': location })
  this.end()
}
exports.simple = function(status, body, hdrs) {
  var encoding
    , defaults = { 'content-type': 'text/plain'
                 , 'content-length': 0
                 }

  if (typeof body === 'object' && !(body instanceof Buffer)) {
    body = JSON.stringify(body)
    defaults['content-type'] = 'application/json'
  }

  body = body || ''
  defaults['content-length'] = body.length

  if (typeof body === 'string') {
    defaults['content-length'] = Buffer.byteLength(body)
    encoding = 'utf8'
  }

  for (var key in hdrs) defaults[key] = hdrs[key]

  this.writeHead(status, defaults)
  this.end(body, encoding)
}
exports.template = function(status, hdrs, tmpl, ctx) {
  var self = this
    , atmpl = config.viewDir + '/' + tmpl;

  ctx['domain'] = config.domain;
  ctx['session'] = self.session;
  ctx['msgs'] = self.msgs;

  nun.render(atmpl, ctx, {}, function(err, out) {
    if (err) return self.simple(500, JSON.stringify(err, null, 2), {});

    hdrs['content-type'] = 'text/html';

    self.writeHead(status, hdrs);

    out.addListener('data', function(chunk) { self.write(chunk, 'utf8'); });
    out.addListener('end', function() { self.end(); });
  });
};
exports.notFound = function(req, res, ctx) {
  res.template(404, {}, 'admin/404.html', {})
}
