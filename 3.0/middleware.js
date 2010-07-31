var sys = require('sys')
  , redis = require('redis-client').createClient()
  , formidable = require('formidable/formidable')
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

      require('sys').log(remoteAddr + ' - - [' + d.toUTCString() + '] ' + req.method + ' ' + req.url + ' HTTP/' + req.httpVersionMajor + '.' + req.httpVersionMinor + ' ' + res.statusCode);
    }, 1, req, res);

    return end.apply(this, arguments);
  };

  next();
};

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

exports.flash = function(req, res, params, next) {
  var key = 'session:' + params.session.id + ':flash'
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

  params.flash = { msgs: [], push: push, del: del };
  
  redis.llen(key, function(err, len) {
    if (err) throw err;

    redis.lrange(key, 0, len, function(err, rep) {
      if (err) throw err;

      var msgs = []
        , rep = rep || [];

      for (var i = 0; i < rep.length; i++) {
        msgs.push({ text: rep[i] });
      }

      params.flash.msgs = res.msgs =  msgs;

      params.flash.del(next);
    });
  });
};

exports.form = function(req, res, params, next) {
  if (req.method.toLowerCase() === 'post') {
    var form = new formidable.IncomingForm();

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

exports.session = function(req, res, params, next) {
  var writeHead = res.writeHead
    , sid = params.cookies['com.kinaj.session'] || helper.fastUUID()
    , key = 'session:' + sid
    , store = function(uid, username) {
        redis.set(key, uid, function(err) {
          if (err) throw err;

          redis.set(key + ':username', username, function(err) {
            if (err) throw err;
          });
        });
      }
    , destroy = function(cb) {
        redis.del(key, function(err) {
          if (err) throw err;

          cb();
        })
      };

  params.session = { id: sid, key: key, store: store, destroy: destroy };

  res.writeHead = function(code, headers) {
    headers = headers || {};
    res.writeHead = writeHead;

    headers['Set-Cookie'] = helper.serializeCookie('com.kinaj.session', params.session.id);

    res.writeHead(code, headers);
  };

  if (params.cookies) {
    redis.get(key, function(err, uid) {
      if (err) throw err;

      params.session.uid = uid;

      redis.get(key + ':username', function(err, username) {
        params.session.username = username;

        res.session = params.session;

        next();
      });
    });
  } else next();
};

exports.authorization = function(req, res, params, next) {
  if (params.authorized && !params.session.uid) {
    params.flash.push('You need to be logged in', function() {
      res.redirect('/login?redirect=' + req.url);
    });
  } else next();
};
