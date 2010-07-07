var nun = require('nun')
  , config = require('./config');

exports.template = function(status, hdrs, tmpl, ctx) {
  var self = this
    , atmpl = config.viewDir + '/' + tmpl;

  ctx['msgs'] = self.msgs;

  nun.render(atmpl, ctx, {}, function(err, out) {
    if (err) throw err;

    hdrs['content-type'] = 'text/html';

    self.writeHead(status, hdrs);

    out.addListener('data', function(chunk) { self.write(chunk, 'utf8'); });
    out.addListener('end', function() { self.end(); });
  });
};
