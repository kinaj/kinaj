var sys = require('sys')
  , config = require('./config')
  , redis = require('redis-client').createClient(config.redis.port, config.redis.host)
  , formidable = require('formidable')
  , helper = require('./helper');

exports.logger = function(req, res, params, next) {
  var writeHead = res.writeHead
    , end = res.end;

  res.writeHead = function(statusCode) {
    res.statusCode = statusCode;

    return writeHead.apply(this, arguments);
  };
  res.end = function() {
    setTimeout(function(req, res) {
      var remoteAddr = req.socket.remoteAddress
        , d = new Date();

      sys.log(remoteAddr + ' - - [' + d.toUTCString() + '] ' + req.method + ' ' + req.url + ' HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + ' ' + res.statusCode);
    }, 1, req, res);

    return end.apply(this, arguments);
  };

  next();
};

exports.context = function(req, res, ctx, next) {
  ctx['domain'] = config.domain

  next()
}

exports.responseTime = function(req, res, params, next) {
  var start = new Date
    , writeHead = res.writeHead;

  res.writeHead = function(code, headers) {
    headers = headers || {};

    res.writeHead = writeHead;

    headers['x-response-time'] = (new Date - start) + 'ms';

    res.writeHead(code, headers);
  };

  next();
};

exports.xhr = function(req, res, params, next) {
  var hdr = req.headers['x-requested-with'];

  params.xhr = (hdr === 'XMLHttpRequest') ? true : false;

  next();
};

exports.flash = function(req, res, ctx, next) {
  var key = ctx.session.sid + ':flash'
    , push = function(text, cb) {
        redis.rpush(key, text, function(err, rep) {
          if (err) throw err;

          cb(rep);
        });
      }
    , del = function(cb) {
        redis.del(key, function(err, rep) {
          if (err) throw err;

          cb(rep);
        });
      };

  ctx.flash = { msgs: [], push: push, del: del };

  redis.llen(key, function(err, len) {
    if (err) throw err;

    redis.lrange(key, 0, len, function(err, rep) {
      if (err) throw err;

      var msgs = []
        , rep = rep || [];

      for (var i = 0; i < rep.length; i++) {
        msgs.push({ text: rep[i] });
      }

      ctx.flash.msgs =  msgs;

      ctx.flash.del(next);
    });
  });
};

exports.form = function(req, res, params, next) {
  var method = req.method.toLowerCase()

  if (method === 'post' || (method === 'put' && /x-www-form-urlencoded/.test(req.headers['content-type']))) {
    var form = new formidable.IncomingForm();

    // form configuration
    form.encoding = 'utf-8';
    form.uploadDir = config.uploadDir;
    form.keepExtensions = true;

    form.parse(req, function(err, fields, files) {
      if (err) throw err;

      params.fields = fields;
      params.files = files;

      next();
    });
  } else next();
};

exports.cookies = function(req, res, params, next) {
  var cookie = req.headers.cookie || '';

  params.cookies = helper.parseCookie(cookie);

  next();
};

exports.session = function(req, res, ctx, next) {
  var writeHead = res.writeHead
    , sid = ctx.cookies['com.kinaj.session'] || helper.fastUUID()
    , key = 'session:' + sid
    , store = function(uid, username, cb) {
        redis.hmset(key, 'uid', uid, 'username', username, function(err, stored) {
          if(err) throw err

          if(cb) cb()
        })
      }
    , destroy = function(cb) {
        redis.del(key, function(err) {
          if (err) throw err

          cb()
        })
      }

  ctx.session = { id: sid, key: key, store: store, destroy: destroy }

  res.writeHead = function(code, headers) {
    headers = headers || {}
    res.writeHead = writeHead

    headers['Set-Cookie'] = helper.serializeCookie('com.kinaj.session', ctx.session.id)

    res.writeHead(code, headers)
  }

  if (ctx.cookies) {
    redis.hgetall(key, function(err, obj) {
      if(err) throw err

      if(obj) ctx.session.mixin(obj), res.session = obj

      next()
    })
  } else next()
}
