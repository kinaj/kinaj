var nun = require('nun')
  , config = require('./config');

exports.redirect = function(location) {
  this.writeHead(302, { 'Location': location })
  this.end()
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
